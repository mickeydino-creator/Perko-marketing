// Facts the legal pages and the footer need. Every value marked [למלא] must be filled in by the operator before
// the pages go live: the code cannot know them.
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
  hosting: '[למלא: שירות אחסון האתר, למשל Netlify או Cloudflare Pages]',
  email: 'Supabase',
};

export const minAge = 13;
export const updated = '26.10.2026';
