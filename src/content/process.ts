export interface ProcessStep {
  number: string
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description: 'We learn your business, your customers and your numbers.',
  },
  {
    number: '02',
    title: 'Plan',
    description: 'A clear plan with priorities, budget and a way to measure it.',
  },
  {
    number: '03',
    title: 'Launch',
    description: 'Creative, campaigns and tracking go live together.',
  },
  {
    number: '04',
    title: 'Improve',
    description: 'Weekly reviews, monthly reports and steady improvements.',
  },
]

export const COMMITMENTS: string[] = [
  'One team for strategy, creative and media.',
  'Reports written in plain language.',
  'A named point of contact.',
]
