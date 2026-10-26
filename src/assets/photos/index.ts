import posterCoffee from './poster-coffee.jpg'
import posterRunner from './poster-runner.jpg'
import posterTravel from './poster-travel.jpg'
import posterFashion from './poster-fashion.jpg'
import posterHome from './poster-home.jpg'
import posterSkincare from './poster-skincare.jpg'
import posterFinance from './poster-finance.jpg'
import posterEducation from './poster-education.jpg'
import posterConcert from './poster-concert.jpg'
import posterCulinary from './poster-culinary.jpg'
import posterAudio from './poster-audio.jpg'
import posterPlants from './poster-plants.jpg'

import strategyCollab from './strategy-collab.jpg'
import whiteboardSession from './whiteboard-session.jpg'
import studioProduction from './studio-production.jpg'
import cameraOperator from './camera-operator.jpg'
import analyticsDashboard from './analytics-dashboard.jpg'
import billboardCity from './billboard-city.jpg'
import designLaptop from './design-laptop.jpg'
import handsCraft from './hands-craft.jpg'
import fashionEditorial from './fashion-editorial.jpg'
import architectureGlass from './architecture-glass.jpg'
import hospitalityLuxury from './hospitality-luxury.jpg'
import b2bBoardroom from './b2b-boardroom.jpg'
import educationLecture from './education-lecture.jpg'

export const PHOTOS = {
  // Posters for Campaign Wall (12 distinct campaign poster creatives)
  'poster-coffee': posterCoffee,
  'poster-runner': posterRunner,
  'poster-travel': posterTravel,
  'poster-fashion': posterFashion,
  'poster-home': posterHome,
  'poster-skincare': posterSkincare,
  'poster-finance': posterFinance,
  'poster-education': posterEducation,
  'poster-concert': posterConcert,
  'poster-culinary': posterCulinary,
  'poster-audio': posterAudio,
  'poster-plants': posterPlants,

  // Editorial & Services imagery
  'strategy-collab': strategyCollab,
  'whiteboard-session': whiteboardSession,
  'studio-production': studioProduction,
  'camera-operator': cameraOperator,
  'analytics-dashboard': analyticsDashboard,
  'billboard-city': billboardCity,
  'design-laptop': designLaptop,
  'hands-craft': handsCraft,
  'fashion-editorial': fashionEditorial,
  'architecture-glass': architectureGlass,
  'hospitality-luxury': hospitalityLuxury,
  'b2b-boardroom': b2bBoardroom,
  'education-lecture': educationLecture,
} as const

export type PhotoKey = keyof typeof PHOTOS
