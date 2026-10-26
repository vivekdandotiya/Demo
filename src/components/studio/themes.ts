import { PHOTOS } from '../../assets/photos'

export interface StudioTheme {
  id: string
  brandName: string
  tagline: string
  headline: string
  subhead: string
  category: string
  handle: string
  avatarInitials: string
  accentColor: string
  accentGlow: string
  artboardBg: string
  artboardCardBg: string
  swatches: string[]
  photoUrl: string
  comments: { user: string; text: string; time: string }[]
  metrics: {
    stat1Label: string
    stat1Val: string
    stat2Label: string
    stat2Val: string
  }
}

export const STUDIO_THEMES: StudioTheme[] = [
  {
    id: 'lumen-coffee',
    brandName: 'Lumen Coffee',
    tagline: 'Artisanal Roastery & Cold Brew Lab',
    headline: 'Fresh. Every day.',
    subhead: 'Single-origin cold extraction // Batch 09',
    category: 'BEVERAGE & HOSPITALITY',
    handle: '@lumen.coffee',
    avatarInitials: 'LC',
    accentColor: '#FF9E2C', // Amber
    accentGlow: 'rgba(255, 158, 44, 0.45)',
    artboardBg: '#161310',
    artboardCardBg: '#211C16',
    swatches: ['#FF9E2C', '#FF3B1F', '#F1ECE2', '#161310'],
    photoUrl: PHOTOS['product-solaris'] || PHOTOS['abstract-neon'],
    comments: [
      { user: 'elena_m', text: 'Need this roast stocked immediately 🔥', time: '2m' },
      { user: 'marcus.d', text: 'Cleanest packaging typography this year.', time: '5m' },
    ],
    metrics: {
      stat1Label: 'Velocity',
      stat1Val: '+84.2%',
      stat2Label: 'Recall',
      stat2Val: '99.1%',
    },
  },
  {
    id: 'nova-fitness',
    brandName: 'Nova Fitness',
    tagline: 'High-Output Biometric Studio',
    headline: 'Peak form. No limits.',
    subhead: 'Adaptive resistance & kinetic tracking',
    category: 'PERFORMANCE & HEALTH',
    handle: '@nova.fitness',
    avatarInitials: 'NF',
    accentColor: '#FF3B1F', // Signal Red-Orange
    accentGlow: 'rgba(255, 59, 31, 0.45)',
    artboardBg: '#141113',
    artboardCardBg: '#1E171B',
    swatches: ['#FF3B1F', '#FF9E2C', '#F1ECE2', '#141113'],
    photoUrl: PHOTOS['product-kinetix'] || PHOTOS['product-velox'],
    comments: [
      { user: 'clara_run', text: 'Finally a studio with real telemetry.', time: '1m' },
      { user: 'david_k', text: 'That frame composition is crazy good.', time: '4m' },
    ],
    metrics: {
      stat1Label: 'Engagement',
      stat1Val: '+112.5%',
      stat2Label: 'Retention',
      stat2Val: '94.8%',
    },
  },
  {
    id: 'atlas-travel',
    brandName: 'Atlas Travel',
    tagline: 'Curated Nordic & Highland Expeditions',
    headline: 'Wander further.',
    subhead: 'Untamed landscapes // Arctic Route 04',
    category: 'LUXURY & EXPEDITIONS',
    handle: '@atlas.travel',
    avatarInitials: 'AT',
    accentColor: '#3D2BFF', // Indigo / Electric
    accentGlow: 'rgba(61, 43, 255, 0.5)',
    artboardBg: '#0F131A',
    artboardCardBg: '#161D28',
    swatches: ['#3D2BFF', '#FF9E2C', '#F1ECE2', '#0F131A'],
    photoUrl: PHOTOS['product-numen'] || PHOTOS['architecture-glass'],
    comments: [
      { user: 'soren_h', text: 'Booked the cabin route just from this visual.', time: '3m' },
      { user: 'mia.nordic', text: 'Color grading is pure cinematic magic.', time: '7m' },
    ],
    metrics: {
      stat1Label: 'Direct Bookings',
      stat1Val: '+78.6%',
      stat2Label: 'Organic Reach',
      stat2Val: '98.3%',
    },
  },
]
