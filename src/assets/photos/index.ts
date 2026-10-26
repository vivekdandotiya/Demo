import strategyCollab from './strategy-collab.jpg'
import whiteboardSession from './whiteboard-session.jpg'
import studioProduction from './studio-production.jpg'
import cameraOperator from './camera-operator.jpg'
import analyticsDashboard from './analytics-dashboard.jpg'
import billboardCity from './billboard-city.jpg'
import designLaptop from './design-laptop.jpg'
import handsCraft from './hands-craft.jpg'
import abstractNeon from './abstract-neon.jpg'
import productSolaris from './product-solaris.jpg'
import productAeris from './product-aeris.jpg'
import productVelox from './product-velox.jpg'
import productKinetix from './product-kinetix.jpg'
import productNumen from './product-numen.jpg'
import fashionEditorial from './fashion-editorial.jpg'
import architectureGlass from './architecture-glass.jpg'
import hospitalityLuxury from './hospitality-luxury.jpg'
import b2bBoardroom from './b2b-boardroom.jpg'
import educationLecture from './education-lecture.jpg'
import ctaBloomBg from './cta-bloom-bg.jpg'

export const PHOTOS: Record<string, string> = {
  'strategy-collab': strategyCollab,
  'whiteboard-session': whiteboardSession,
  'studio-production': studioProduction,
  'camera-operator': cameraOperator,
  'analytics-dashboard': analyticsDashboard,
  'billboard-city': billboardCity,
  'design-laptop': designLaptop,
  'hands-craft': handsCraft,
  'abstract-neon': abstractNeon,
  'product-solaris': productSolaris,
  'product-aeris': productAeris,
  'product-velox': productVelox,
  'product-kinetix': productKinetix,
  'product-numen': productNumen,
  'fashion-editorial': fashionEditorial,
  'architecture-glass': architectureGlass,
  'hospitality-luxury': hospitalityLuxury,
  'b2b-boardroom': b2bBoardroom,
  'education-lecture': educationLecture,
  'cta-bloom-bg': ctaBloomBg,
}

export function getPhoto(key: string): string {
  return PHOTOS[key] || abstractNeon
}
