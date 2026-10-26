import { PHOTOS, PhotoKey } from '../assets/photos'

export interface PosterItem {
  id: string
  brand: string
  headline: string
  cta: string
  tag: string
  format: '4:5' | '9:16'
  photoKey: PhotoKey
  accent: string
}

export const CAMPAIGN_POSTERS: PosterItem[] = [
  {
    id: 'p-brewlab',
    brand: 'Brew Lab',
    headline: 'Cold brew, now in cans.',
    cta: 'Order now',
    tag: 'Beverage & D2C',
    format: '4:5',
    photoKey: 'poster-coffee',
    accent: '#C8A882',
  },
  {
    id: 'p-stridefit',
    brand: 'StrideFit',
    headline: 'Your first 5K starts here.',
    cta: 'Start training',
    tag: 'Fitness Tech',
    format: '9:16',
    photoKey: 'poster-runner',
    accent: '#8EB5F0',
  },
  {
    id: 'p-atlasstays',
    brand: 'Atlas Stays',
    headline: 'Weekend escapes, sorted.',
    cta: 'Explore cabins',
    tag: 'Hospitality',
    format: '4:5',
    photoKey: 'poster-travel',
    accent: '#A3B18A',
  },
  {
    id: 'p-oakthread',
    brand: 'Oak & Thread',
    headline: 'The autumn drop is live.',
    cta: 'Shop the drop',
    tag: 'Apparel',
    format: '9:16',
    photoKey: 'poster-fashion',
    accent: '#D4A373',
  },
  {
    id: 'p-havenhomes',
    brand: 'Haven Homes',
    headline: 'Find the one with a view.',
    cta: 'View properties',
    tag: 'Architecture',
    format: '4:5',
    photoKey: 'poster-home',
    accent: '#CCD5AE',
  },
  {
    id: 'p-dewskin',
    brand: 'Dew Skin',
    headline: 'Skincare that keeps it simple.',
    cta: 'Discover routine',
    tag: 'Clean Skincare',
    format: '9:16',
    photoKey: 'poster-skincare',
    accent: '#E9D8A6',
  },
  {
    id: 'p-ledgerly',
    brand: 'Ledgerly',
    headline: 'Invoices, done by Friday.',
    cta: 'Try free',
    tag: 'B2B SaaS',
    format: '4:5',
    photoKey: 'poster-finance',
    accent: '#94D2BD',
  },
  {
    id: 'p-brightminds',
    brand: 'Bright Minds',
    headline: 'Admissions open this term.',
    cta: 'Apply now',
    tag: 'Higher Ed',
    format: '9:16',
    photoKey: 'poster-education',
    accent: '#EE9B00',
  },
  {
    id: 'p-livenights',
    brand: 'Live Nights',
    headline: 'Live music, one night only.',
    cta: 'Get tickets',
    tag: 'Live Events',
    format: '4:5',
    photoKey: 'poster-concert',
    accent: '#CA6702',
  },
  {
    id: 'p-spiceroute',
    brand: 'Spice Route',
    headline: 'Dinner worth the detour.',
    cta: 'Reserve table',
    tag: 'Culinary',
    format: '9:16',
    photoKey: 'poster-culinary',
    accent: '#BB3E03',
  },
  {
    id: 'p-voltaudio',
    brand: 'Volt Audio',
    headline: 'Sound that follows you.',
    cta: 'Listen now',
    tag: 'Audio Hardware',
    format: '4:5',
    photoKey: 'poster-audio',
    accent: '#0A9396',
  },
  {
    id: 'p-greenleaf',
    brand: 'Greenleaf Co.',
    headline: 'Plants delivered weekly.',
    cta: 'Choose plan',
    tag: 'Botanical D2C',
    format: '9:16',
    photoKey: 'poster-plants',
    accent: '#52B788',
  },
]
