// Facts the legal pages and the footer need. Every value marked [למלא] must be filled in by the operator before
// the pages go live: the code cannot know them.
export const operator = {
  name: '[למלא: שם מלא של המפעיל או שם החברה]',
  id: '[למלא: מספר עוסק או ח.פ., כשיהיה]',
  email: '[למלא: כתובת אימייל ליצירת קשר]',
  city: 'ירושלים',
};

export const accessibilityContact = {
  name: '[למלא: שם רכז/ת הנגישות]',
  email: operator.email,
  phone: '[למלא: טלפון, לא חובה]',
};

export const processors = {
  // Where the app's data lives. Check Supabase > Project settings > General > Region.
  supabaseRegion: '[למלא: אזור פרויקט Supabase, למשל אירופה (פרנקפורט)]',
  formProvider: '[למלא: השירות שמקבל את טופס העסקים, כשיחובר]',
  hosting: '[למלא: שירות אחסון האתר, למשל Netlify או Cloudflare Pages]',
  email: '[למלא: ספק שליחת האימייל של קוד הכניסה]',
};

export const minAge = 16;
export const updated = '26.10.2026';
