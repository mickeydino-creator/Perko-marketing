// Facts the legal pages and the footer need. Keep them current: they are published on /privacy, /terms and /accessibility.
export const operator = {
  name: 'עילי דינוביץ',
  email: 'ilaidinow@gmail.com',
  city: 'ירושלים',
};

export const accessibilityContact = {
  name: operator.name,
  email: operator.email,
};

export const processors = {
  // Where the app's data lives. Check Supabase > Project settings > General > Region.
  supabaseRegion: 'האיחוד האירופי (פרנקפורט, גרמניה)',
  formProvider: 'הטופס עדיין לא מחובר לשום שירות. כשיחובר, נעדכן כאן את שם השירות',
  hosting: 'Vercel',
  email: 'Supabase',
};

export const minAge = 13;
export const updated = '26.10.2026';
