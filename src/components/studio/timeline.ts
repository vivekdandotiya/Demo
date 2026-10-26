import { gsap } from '../../lib/gsap'
import { STUDIO_THEMES, StudioTheme } from './themes'
import { TeammateCursorState } from './Cursors'

export interface StudioTimelineState {
  themeIndex: number
  theme: StudioTheme
  typedText: string
  isShapeDrawn: boolean
  isPhotoDropped: boolean
  isHandlesVisible: boolean
  activeSwatchIndex: number
  zoomPercent: number
  isExporting: boolean
  thuStatus: 'draft' | 'scheduled' | 'published'
  isPostPublished: boolean
  floatingHeartsCount: number
  showComments: boolean
  curveProgress: number
  shiftMoodboard: boolean
  showApproved: boolean
  showScheduledToast: boolean
  flyingCard: {
    visible: boolean
    x: number
    y: number
    scale: number
    opacity: number
  }
  cursors: TeammateCursorState
}

export const INITIAL_TIMELINE_STATE: StudioTimelineState = {
  themeIndex: 0,
  theme: STUDIO_THEMES[0],
  typedText: '',
  isShapeDrawn: false,
  isPhotoDropped: false,
  isHandlesVisible: false,
  activeSwatchIndex: 0,
  zoomPercent: 62,
  isExporting: false,
  thuStatus: 'draft',
  isPostPublished: false,
  floatingHeartsCount: 0,
  showComments: false,
  curveProgress: 0,
  shiftMoodboard: false,
  showApproved: false,
  showScheduledToast: false,
  flyingCard: {
    visible: false,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 0,
  },
  cursors: {
    maya: { x: 80, y: 140, clicking: false, visible: true },
    arjun: { x: 380, y: 70, clicking: false, visible: true },
    sam: { x: 260, y: 320, clicking: false, visible: true, greeting: false },
    visitorOverWall: false,
  },
}

export function createStudioTimeline(
  onUpdate: (state: StudioTimelineState) => void,
  isReducedMotion: boolean = false
) {
  if (isReducedMotion) {
    // Return static completed state
    onUpdate({
      ...INITIAL_TIMELINE_STATE,
      typedText: STUDIO_THEMES[0].headline,
      isShapeDrawn: true,
      isPhotoDropped: true,
      isHandlesVisible: false,
      activeSwatchIndex: 1,
      zoomPercent: 80,
      thuStatus: 'published',
      isPostPublished: true,
      floatingHeartsCount: 4,
      showComments: true,
      curveProgress: 1,
      shiftMoodboard: true,
      showApproved: true,
      showScheduledToast: true,
    })
    return {
      play: () => {},
      pause: () => {},
      kill: () => {},
    }
  }

  let currentThemeIdx = 0
  const state: StudioTimelineState = {
    ...INITIAL_TIMELINE_STATE,
    theme: STUDIO_THEMES[0],
  }

  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: 'power2.inOut' },
  })

  // Helper to commit state update
  const commit = () => onUpdate({ ...state, theme: STUDIO_THEMES[currentThemeIdx] })

  // -------------------------------------------------------------
  // 0.0s - 1.2s: INTRO ASSEMBLE
  // -------------------------------------------------------------
  tl.set({}, {}, 0.0)

  // -------------------------------------------------------------
  // 1.2s - 7.0s: DESIGN PHASE
  // -------------------------------------------------------------
  // 1.2s: Maya moves cursor to SVG shape tool & draws circle
  tl.to(
    state.cursors.maya,
    {
      x: 140,
      y: 95,
      duration: 1.0,
      onUpdate: commit,
    },
    1.2
  )

  tl.set(state.cursors.maya, { clicking: true }, 2.2)
  tl.set(state, { isShapeDrawn: true }, 2.3)
  tl.set(state.cursors.maya, { clicking: false }, 2.5)

  // 2.5s - 4.5s: Maya moves to artboard and types headline
  tl.to(
    state.cursors.maya,
    {
      x: 180,
      y: 190,
      duration: 0.8,
      onUpdate: commit,
    },
    2.5
  )

  const theme0 = STUDIO_THEMES[currentThemeIdx]
  const fullText = theme0.headline
  const typeDuration = 1.8

  tl.to(
    {},
    {
      duration: typeDuration,
      onUpdate: function () {
        const prog = this.progress()
        const chars = Math.floor(prog * fullText.length)
        state.typedText = fullText.slice(0, chars)
        commit()
      },
    },
    3.3
  )

  // 4.6s: Product photo drops in
  tl.set(state, { isPhotoDropped: true, isHandlesVisible: true }, 4.6)

  // 4.8s - 5.6s: Maya clicks color swatch
  tl.to(
    state.cursors.maya,
    {
      x: 445,
      y: 280,
      duration: 0.8,
      onUpdate: commit,
    },
    4.8
  )
  tl.set(state.cursors.maya, { clicking: true }, 5.6)
  tl.set(state, { activeSwatchIndex: 1 }, 5.7)
  tl.set(state.cursors.maya, { clicking: false }, 5.9)

  // 5.9s - 6.8s: Zoom label animates 62% -> 80%
  tl.to(
    state,
    {
      zoomPercent: 80,
      duration: 0.9,
      onUpdate: commit,
    },
    5.9
  )

  // -------------------------------------------------------------
  // 7.0s - 11.0s: SCHEDULE PHASE
  // -------------------------------------------------------------
  // 7.0s: Maya moves to Export button
  tl.to(
    state.cursors.maya,
    {
      x: 470,
      y: 18,
      duration: 0.7,
      onUpdate: commit,
    },
    6.9
  )
  tl.set(state.cursors.maya, { clicking: true }, 7.6)
  tl.set(state, { isExporting: true }, 7.7)
  tl.set(state.cursors.maya, { clicking: false }, 7.9)

  // 7.8s: Flying thumbnail card emerges and travels along arc to Calendar Thu slot
  tl.set(
    state.flyingCard,
    { visible: true, opacity: 1, scale: 0.8, x: 200, y: 150 },
    7.8
  )

  tl.to(
    state.flyingCard,
    {
      x: 430,
      y: -20,
      scale: 0.28,
      opacity: 0.85,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: commit,
    },
    7.9
  )

  // Land in Thu slot: status turns to Scheduled
  tl.set(
    state,
    {
      isExporting: false,
      thuStatus: 'scheduled',
      showScheduledToast: true,
      flyingCard: { ...state.flyingCard, visible: false },
    },
    9.7
  )

  // Arjun cursor moves to check slot
  tl.to(
    state.cursors.arjun,
    {
      x: 420,
      y: 20,
      duration: 1.0,
      onUpdate: commit,
    },
    9.5
  )
  tl.set(state.cursors.arjun, { clicking: true }, 10.5)
  tl.set(state.cursors.arjun, { clicking: false }, 10.8)

  // -------------------------------------------------------------
  // 11.0s - 16.0s: PUBLISH PHASE
  // -------------------------------------------------------------
  // Artwork publishes to phone feed
  tl.set(state, { isPostPublished: true, thuStatus: 'published' }, 11.0)

  // Floating hearts rise
  tl.to(
    state,
    {
      floatingHeartsCount: 6,
      duration: 1.8,
      ease: 'power1.out',
      onUpdate: commit,
    },
    11.2
  )

  // Comment bubbles spring in
  tl.set(state, { showComments: true }, 12.5)

  // Sam cursor reacts to comments
  tl.to(
    state.cursors.sam,
    {
      x: 320,
      y: 220,
      duration: 1.2,
      onUpdate: commit,
    },
    12.6
  )

  // -------------------------------------------------------------
  // 16.0s - 20.0s: MEASURE PHASE
  // -------------------------------------------------------------
  // Analytics curve self-draws
  tl.to(
    state,
    {
      curveProgress: 1.0,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: commit,
    },
    16.0
  )

  // Moodboard tile shift
  tl.set(state, { shiftMoodboard: true }, 17.5)

  // Note card "Approved" pops up
  tl.set(state, { showApproved: true }, 18.0)

  // -------------------------------------------------------------
  // 20.0s - 22.0s: RESET PHASE (Smooth loop transition)
  // -------------------------------------------------------------
  tl.to(
    {},
    {
      duration: 1.5,
      onComplete: () => {
        // Cycle to next brand theme
        currentThemeIdx = (currentThemeIdx + 1) % STUDIO_THEMES.length
        state.themeIndex = currentThemeIdx
        state.theme = STUDIO_THEMES[currentThemeIdx]

        // Reset stage flags for next brand
        state.typedText = ''
        state.isShapeDrawn = false
        state.isPhotoDropped = false
        state.isHandlesVisible = false
        state.activeSwatchIndex = 0
        state.zoomPercent = 62
        state.isExporting = false
        state.thuStatus = 'draft'
        state.isPostPublished = false
        state.floatingHeartsCount = 0
        state.showComments = false
        state.curveProgress = 0
        state.shiftMoodboard = false
        state.showApproved = false
        state.showScheduledToast = false
        commit()
      },
    },
    20.5
  )

  return {
    play: () => tl.play(),
    pause: () => tl.pause(),
    kill: () => tl.kill(),
  }
}
