import { PhotoKey } from '../assets/photos'

export interface ServiceItem {
  id: string
  number: string
  name: string
  promise: string
  description: string
  deliverables: string[]
  photoKey: PhotoKey
}

export const SERVICES_CONTENT: ServiceItem[] = [
  {
    id: 'seo-search',
    number: '01',
    name: 'SEO & Search',
    promise: 'Show up when people are searching.',
    description:
      'Technical fixes, content that matches search intent and links that build authority, tracked every month.',
    deliverables: [
      'Technical audit and fixes',
      'Keyword and intent map',
      'On-page and content optimization',
      'Link building and monthly reporting',
    ],
    photoKey: 'analytics-dashboard',
  },
  {
    id: 'paid-advertising',
    number: '02',
    name: 'Paid Advertising',
    promise: 'Pay for results, not just clicks.',
    description:
      'Google, Meta, LinkedIn and YouTube campaigns built around your cost per lead and managed every week.',
    deliverables: [
      'Channel and budget plan',
      'Ad creative and copy testing',
      'Conversion tracking setup',
      'Weekly optimization and reporting',
    ],
    photoKey: 'billboard-city',
  },
  {
    id: 'social-media',
    number: '03',
    name: 'Social Media',
    promise: 'Show up consistently and sound like yourself.',
    description:
      'Content calendars, design and community management that keep your channels active and on brand.',
    deliverables: [
      'Content strategy and calendar',
      'Posts, reels and stories',
      'Community management',
      'Monthly performance review',
    ],
    photoKey: 'camera-operator',
  },
  {
    id: 'content-strategy',
    number: '04',
    name: 'Content Strategy',
    promise: 'Content with a job to do.',
    description:
      'We work out what your audience needs to hear, then plan and produce it with writers, designers and editors.',
    deliverables: [
      'Audience and messaging research',
      'Blog, video and email planning',
      'Production across text and video',
      'Distribution and outreach plan',
    ],
    photoKey: 'whiteboard-session',
  },
  {
    id: 'brand-growth',
    number: '05',
    name: 'Brand Growth',
    promise: 'A brand that is easy to choose.',
    description:
      'Positioning, identity and messaging so customers understand what you do and why you do it better.',
    deliverables: [
      'Positioning and messaging framework',
      'Visual identity refresh',
      'Brand guidelines and stylebook',
      'Launch and rollout plan',
    ],
    photoKey: 'hands-craft',
  },
  {
    id: 'conversion-optimization',
    number: '06',
    name: 'Conversion Optimization',
    promise: 'Turn more visitors into enquiries.',
    description:
      'We study how people use your site, then test changes to pages, forms and offers.',
    deliverables: [
      'Funnel and analytics review',
      'Landing page design and testing',
      'Form and checkout improvements',
      'A/B test reporting and iterations',
    ],
    photoKey: 'design-laptop',
  },
]
