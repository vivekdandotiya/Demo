import { PhotoKey } from '../assets/photos'

export interface WorkProject {
  id: string
  name: string
  category: string
  strategy: string
  aspectRatio: '4:3' | '4:5' | '3:2'
  photoKey: PhotoKey
  challenge: string
  approach: string
  channels: string[]
  results?: string[]
}

export const SELECTED_WORK: WorkProject[] = [
  {
    id: 'brew-lab',
    name: 'Brew Lab',
    category: 'Social + Paid',
    strategy: 'Repositioning specialty cold brew as a daily ritual through creator-led short-form video and paid funnels.',
    aspectRatio: '4:3',
    photoKey: 'poster-coffee',
    challenge: 'Specialty ready-to-drink coffee was perceived as an occasional premium treat rather than a pantry staple.',
    approach: 'We developed an unpolished creator aesthetic focusing on morning kitchen rituals, tested 24 hook variations across Meta and TikTok, and paired paid acquisition with bundle subscriptions.',
    channels: ['Meta Ads', 'TikTok', 'Creative Production', 'Lifecycle Email'],
  },
  {
    id: 'atlas-stays',
    name: 'Atlas Stays',
    category: 'SEO + Content',
    strategy: 'Building high-intent editorial destination guides that capture organic search demand before booking aggregators.',
    aspectRatio: '4:5',
    photoKey: 'poster-travel',
    challenge: 'Dependence on high-commission travel platforms was eroding unit economics for boutique alpine cabins.',
    approach: 'We built a programmatic content architecture mapped to hyper-local travel intent, paired with cinematic photography and technical schema to capture Google Travel features directly.',
    channels: ['Technical SEO', 'Editorial Writing', 'Photography', 'Digital PR'],
  },
  {
    id: 'haven-homes',
    name: 'Haven Homes',
    category: 'Brand + Conversion',
    strategy: 'Refining visual identity and designing frictionless private viewing enquiry flows for architectural properties.',
    aspectRatio: '3:2',
    photoKey: 'poster-home',
    challenge: 'A cluttered website and generic real estate copy led to low private viewing bookings from qualified buyers.',
    approach: 'We stripped away vanity animations, elevated full-bleed property photography, and redesigned the booking flow with progressive disclosure and instant calendar reservation.',
    channels: ['Brand Identity', 'UX Design', 'Conversion Optimization', 'Search Ads'],
  },
]
