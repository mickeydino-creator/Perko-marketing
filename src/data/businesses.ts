// Illustrative businesses used in the mockups and the demo. None of them is a real participant.
export type Program = {
  id: string;
  name: string;
  kind: string;
  program: string;
  type: 'stamps' | 'points';
  total: number;
  current: number;
  step: number;
  reward: string;
  rule: string;
  initial: string;
  tone: 'cobalt' | 'ink' | 'pale';
};

export const businesses: Program[] = [
  {
    id: 'cafe',
    name: 'קפה פינה',
    kind: 'בית קפה שכונתי',
    program: 'כרטיס קפה',
    type: 'stamps',
    total: 10,
    current: 7,
    step: 1,
    reward: 'קפה הפוך עלינו',
    rule: 'חותמת על כל משקה חם',
    initial: 'פ',
    tone: 'cobalt',
  },
  {
    id: 'restaurant',
    name: 'זעתר',
    kind: 'מסעדה שכונתית',
    program: 'כרטיס ארוחות',
    type: 'stamps',
    total: 6,
    current: 4,
    step: 1,
    reward: 'קינוח לשניים',
    rule: 'חותמת על כל ארוחה במקום',
    initial: 'ז',
    tone: 'ink',
  },
  {
    id: 'shop',
    name: 'דפדוף',
    kind: 'חנות ספרים מקומית',
    program: 'מועדון קוראים',
    type: 'points',
    total: 200,
    current: 120,
    step: 20,
    reward: 'שובר 30 ₪ לקנייה הבאה',
    rule: '20 נקודות על כל קנייה',
    initial: 'ד',
    tone: 'pale',
  },
];
