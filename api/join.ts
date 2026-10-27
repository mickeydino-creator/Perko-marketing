// Vercel Function: POST /api/join. Receives the business sign-up form and emails it to Perko through Resend.
// Environment (Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY   a Resend API key with sending access
//   JOIN_TO_EMAIL    where sign-ups are delivered (comma-separated for several addresses)
//   JOIN_FROM_EMAIL  optional sender on a domain verified in Resend, default "Perko <hello@getperko.com>"
// Nothing is stored here: the details exist only in the email.

const LIMITS = { business: 80, type: 60, name: 60, contact: 80, message: 600 } as const;
type Field = keyof typeof LIMITS;
const TYPES = ['בית קפה', 'מסעדה', 'מאפייה או קונדיטוריה', 'חנות מקומית', 'שירותים (מספרה, כושר, קוסמטיקה)', 'אחר'];
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRe = /^(?:\+?972[-\s]?|0)(?:[23489]|5\d|7\d)[-\s]?\d{3}[-\s]?\d{4}$/; // same rules as src/scripts/main.ts

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(request: Request): Promise<Response> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.JOIN_TO_EMAIL;
  if (!key || !to) return json(503, { error: 'not_configured' });

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return json(400, { error: 'bad_json' });
  }
  // Spam trap (the client never sends it; a bot posting directly might).
  if (typeof raw.website === 'string' && raw.website) return json(200, { ok: true });

  const data = {} as Record<Field, string>;
  for (const f of Object.keys(LIMITS) as Field[]) {
    const v = typeof raw[f] === 'string' ? (raw[f] as string).trim() : '';
    if (v.length > LIMITS[f]) return json(400, { error: 'too_long', field: f });
    data[f] = v;
  }
  const contactOk = emailRe.test(data.contact) || phoneRe.test(data.contact.replace(/[()]/g, ''));
  if (data.business.length < 2 || data.name.length < 2 || !TYPES.includes(data.type) || !contactOk) {
    return json(400, { error: 'invalid' });
  }

  const rows: [string, string][] = [
    ['שם העסק', data.business],
    ['סוג העסק', data.type],
    ['איש קשר', data.name],
    ['אימייל או טלפון', data.contact],
    ['הודעה', data.message || '-'],
  ];
  const text = `פנייה חדשה מטופס ההצטרפות באתר Perko\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n`;
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#11130F">
<p style="font-size:17px;font-weight:bold;margin:0 0 12px">פנייה חדשה מטופס ההצטרפות באתר Perko</p>
<table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 0 4px 16px;color:#303626;vertical-align:top">${esc(k)}</td><td style="padding:4px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')}</table></div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.JOIN_FROM_EMAIL || 'Perko <hello@getperko.com>',
      to: to.split(',').map((s) => s.trim()).filter(Boolean),
      subject: `הצטרפות לפרקו: ${data.business}`.replace(/[\r\n]+/g, ' '),
      text,
      html,
      ...(emailRe.test(data.contact) ? { reply_to: data.contact } : {}),
    }),
  });
  if (!res.ok) {
    console.error('resend failed', res.status, await res.text().catch(() => ''));
    return json(502, { error: 'send_failed' });
  }
  return json(200, { ok: true });
}
