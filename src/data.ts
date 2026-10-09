export interface Deal {
  name: string;
  source: string;
  stage: string;
  score: number;
  rep: string;
  deal_value: number;
  created: string;
}

export const dealsData: Deal[] = [
  { name: 'Sarah Mitchell', source: 'meta_ads', stage: 'Won', score: 80, rep: 'Priya', deal_value: 3000, created: '2026-09-01' },
  { name: 'James Carter', source: 'meta_ads', stage: 'Call Booked', score: 65, rep: 'Jake', deal_value: 0, created: '2026-09-02' },
  { name: 'Priya Nair', source: 'referral', stage: 'Won', score: 90, rep: 'Jake', deal_value: 3000, created: '2026-09-02' },
  { name: 'Tom Hughes', source: 'Meta Ads', stage: 'No Show', score: 40, rep: 'Priya', deal_value: 0, created: '2026-09-03' },
  { name: 'Aisha Khan', source: 'instagram', stage: 'Contacted', score: 30, rep: '', deal_value: 0, created: '2026-09-04' },
  { name: 'Luke Bennett', source: 'meta_ads', stage: 'Lost', score: 55, rep: 'Jake', deal_value: 0, created: '2026-09-05' },
  { name: 'Maria Lopez', source: 'referral', stage: 'Call Booked', score: 75, rep: 'Priya', deal_value: 0, created: '2026-09-06' },
  { name: 'Daniel Reed', source: 'Instagram', stage: 'New Lead', score: 20, rep: '', deal_value: 0, created: '2026-09-07' },
  { name: 'Emma Wilson', source: 'meta_ads', stage: 'Won', score: 85, rep: 'Priya', deal_value: 3000, created: '2026-09-08' },
  { name: 'Ryan Patel', source: 'meta_ads', stage: 'Contacted', score: 45, rep: '', deal_value: 0, created: '2026-09-09' },
  { name: 'Chloe Adams', source: 'instagram', stage: 'No Show', score: 60, rep: 'Jake', deal_value: 0, created: '2026-09-10' },
  { name: 'Omar Farouk', source: 'referral', stage: 'Call Booked', score: 70, rep: 'Jake', deal_value: 0, created: '2026-09-11' },
  { name: 'Grace Liu', source: 'meta_ads', stage: 'Lost', score: 50, rep: 'Priya', deal_value: 0, created: '2026-09-14' },
  { name: 'Noah Brooks', source: 'meta_ads', stage: 'Won', score: 95, rep: 'Jake', deal_value: 3000, created: '2026-09-15' },
  { name: 'Zara Ahmed', source: 'instagram', stage: 'New Lead', score: 25, rep: '', deal_value: 0, created: '2026-09-16' },
  { name: 'Ben Turner', source: 'Meta Ads', stage: 'Call Booked', score: 70, rep: 'Priya', deal_value: 0, created: '2026-09-18' },
  { name: 'Olivia Grant', source: 'referral', stage: 'Won', score: 80, rep: 'Priya', deal_value: 3000, created: '2026-09-21' },
  { name: 'Leo Martin', source: 'meta_ads', stage: 'No Show', score: 65, rep: 'Jake', deal_value: 0, created: '2026-09-22' },
  { name: 'Mia Clarke', source: 'instagram', stage: 'Contacted', score: 35, rep: '', deal_value: 0, created: '2026-09-24' },
  { name: 'Ethan Shah', source: 'meta_ads', stage: 'Lost', score: 60, rep: 'Jake', deal_value: 0, created: '2026-09-28' },
];

// Helper to normalize deal values for logic
export const getNormalizedData = () => {
  return dealsData.map(d => ({
    ...d,
    source: d.source.toLowerCase().replace('_', ' '),
  }));
};
