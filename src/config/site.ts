export interface SiteConfig {
  name: string
  tagline: string
  description: string
  location: string
  email: string
  phone: string
  whatsapp: string
  bookingUrl: string
  formEndpoint?: string
  confirmationTime?: string
  showSampleWorkNote: boolean
  worksWithSmallBusiness: boolean
  socials: {
    name: string
    url: string
  }[]
  budgetRanges: string[]
  navLinks: {
    label: string
    href: string
  }[]
}

export const SITE_CONFIG: SiteConfig = {
  name: 'Meridian Digital',
  tagline: 'Strategy, creative and performance marketing from one team.',
  description: 'We plan the campaign, make the content and run the media, so every bit of ad spend has a job to do.',
  location: 'London & Worldwide',
  email: 'hello@meridiandigital.com',
  phone: '+44 20 7946 0912',
  whatsapp: 'https://wa.me/442079460912',
  bookingUrl: 'https://cal.com/meridian-digital/strategy',
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
  confirmationTime: 'We respond to all qualified briefs within one business day.',
  showSampleWorkNote: true,
  worksWithSmallBusiness: true,
  socials: [
    { name: 'LinkedIn', url: 'https://linkedin.com/company/meridian-digital' },
    { name: 'Instagram', url: 'https://instagram.com/meridiandigital' },
    { name: 'X / Twitter', url: 'https://x.com/meridiandigital' },
  ],
  budgetRanges: [
    '£3,000 – £6,000 / month',
    '£6,000 – £12,000 / month',
    '£12,000 – £25,000 / month',
    '£25,000+ / month',
    'Fixed-scope project (£10,000+)',
  ],
  navLinks: [
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Work', href: '#work' },
    { label: 'FAQ', href: '#faq' },
  ],
}
