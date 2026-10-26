export interface Project {
  id: string
  title: string
  clientType: string
  tagline: string
  description: string
  challenge: string
  strategy: string
  channels: string[]
  metricsLabel: string
  metricsContext: string
  palette: [string, string, string]
  year: string
  category: string
  badge: 'Concept project'
  photoKey: string
}

export interface Service {
  id: string
  number: string
  title: string
  italicWord: string
  shortPromise: string
  deliverables: string[]
  gradient: string
  color: string
}

export interface ApproachStep {
  step: string
  title: string
  subhead: string
  description: string
  detail: string
  photoKey: string
}

export interface PackageTier {
  id: string
  name: string
  badge: string
  timeframe: string
  description: string
  deliverables: string[]
  commitment: string
  ctaText: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface IndustryItem {
  id: string
  name: string
  lead: string
  narrative: string
  channels: string[]
  photoKey: string
}

export const SITE_CONFIG = {
  name: 'UNMISSABLE',
  tagline: 'From Invisible to Unmissable',
  heroHeadline: {
    prefix: 'Be impossible',
    highlight: 'to ignore.',
  },
  studioType: 'Creative Digital Marketing Studio',
  bookingUrl: 'https://cal.com/your-link',
  email: 'hello@your-domain.com',
  phone: '+1 (555) 019-2834',
  location: 'New York & London / Worldwide',
  teamPlaceholder: 'Led by a compact council of 12 senior strategists, creative directors, and data engineers.',
  showTestimonialsSlot: false, // Default hidden; set true to display social proof placeholder
  socials: [
    { name: 'X / Twitter', url: 'https://twitter.com/your-handle' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/your-agency' },
    { name: 'Instagram', url: 'https://instagram.com/your-agency' },
    { name: 'Substack', url: 'https://your-agency.substack.com' },
  ],
  navLinks: [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Studio', href: '#studio' },
    { label: 'Industries', href: '#industries' },
    { label: 'Approach', href: '#approach' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Packages', href: '#packages' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
  services: [
    {
      id: 'seo-search',
      number: '01',
      title: 'SEO & Search',
      italicWord: 'Search',
      shortPromise: 'Be the answer when your customers ask the question.',
      deliverables: [
        'High-intent search authority & architecture',
        'Semantic topical clustering & technical crawl efficiency',
        'Generative search optimization (AI Overviews & LLM recall)',
      ],
      gradient: 'linear-gradient(135deg, #FF3B1F 0%, #FF9E2C 100%)',
      color: '#FF3B1F',
    },
    {
      id: 'paid-advertising',
      number: '02',
      title: 'Paid Advertising',
      italicWord: 'Advertising',
      shortPromise: 'Media spend that earns its keep, tuned weekly.',
      deliverables: [
        'Algorithmic paid social & meta creative iteration',
        'Search engine arbitrage & intent-driven capture',
        'First-party tracking & cookieless attribution modeling',
      ],
      gradient: 'linear-gradient(135deg, #FF9E2C 0%, #FF2E93 100%)',
      color: '#FF9E2C',
    },
    {
      id: 'social-media',
      number: '03',
      title: 'Social Media',
      italicWord: 'Social',
      shortPromise: 'Stories and systems that turn followers into a community.',
      deliverables: [
        'Cultural pulse narrative & reactive storytelling',
        'Short-form vertical video direction & distribution engines',
        'Founder presence & organic distribution frameworks',
      ],
      gradient: 'linear-gradient(135deg, #FF2E93 0%, #8A2BE2 100%)',
      color: '#FF2E93',
    },
    {
      id: 'content-strategy',
      number: '04',
      title: 'Content Strategy',
      italicWord: 'Content',
      shortPromise: 'Words and visuals with a point of view and a plan.',
      deliverables: [
        'Editorial positioning & contrarian narrative pillars',
        'High-density teardowns, whitepapers & case studies',
        'Repurposing pipelines across audio, newsletter & social',
      ],
      gradient: 'linear-gradient(135deg, #8A2BE2 0%, #3D2BFF 100%)',
      color: '#8A2BE2',
    },
    {
      id: 'brand-growth',
      number: '05',
      title: 'Brand Growth',
      italicWord: 'Growth',
      shortPromise: 'Positioning that makes everything else easier to sell.',
      deliverables: [
        'Category creation & wedge positioning architecture',
        'Visual identity systems tailored for digital feed presence',
        'Tone of voice manuals & go-to-market playbooks',
      ],
      gradient: 'linear-gradient(135deg, #3D2BFF 0%, #00F0FF 100%)',
      color: '#3D2BFF',
    },
    {
      id: 'conversion-optimization',
      number: '06',
      title: 'Conversion CRO',
      italicWord: 'Conversion',
      shortPromise: 'Fewer clicks between interest and action.',
      deliverables: [
        'Frictionless user flow & cognitive load reduction',
        'Continuous Bayesian A/B hypothesis testing',
        'High-velocity bespoke landing page architecture',
      ],
      gradient: 'linear-gradient(135deg, #FF3B1F 0%, #FF2E93 100%)',
      color: '#FF3B1F',
    },
  ] as Service[],
  projects: [
    {
      id: 'solaris-energy',
      title: 'SOLARIS',
      clientType: 'Decentralized Clean Energy Grid',
      category: 'Brand & Launch Campaign',
      year: '2026',
      tagline: 'Making clean kilowatt-hours visually tactile.',
      description: 'A full-funnel positioning overhaul turning complex power infrastructure into an intuitive consumer brand.',
      challenge: 'Legacy clean-tech communication was cold, bureaucratic, and failed to spark consumer retail momentum.',
      strategy: 'We transformed energy monitoring into kinetic data art, launching an interactive micro-site and multi-channel motion blitz.',
      channels: ['Motion Identity', 'Search Strategy', 'Interactive WebGL', 'Paid Social Sprint'],
      metricsLabel: 'Attention velocity (Illustrative)',
      metricsContext: 'Simulated 3.4x lift in dwell time across concept test cohorts.',
      palette: ['#FF3B1F', '#FF9E2C', '#101013'],
      badge: 'Concept project',
      photoKey: 'product-solaris',
    },
    {
      id: 'aeris-audio',
      title: 'AERIS HIFI',
      clientType: 'Acoustic Hardware Innovation',
      category: 'Category Positioning & CRO',
      year: '2025',
      tagline: 'Sound that commands the silence around it.',
      description: 'Crafting the launch narrative for high-end spatial audio headphones against entrenched legacy giants.',
      challenge: 'Crowded DTC headphone market where specs sound identical and audiophile terminology repels mainstream buyers.',
      strategy: 'Focus purely on emotional acoustic clarity through visceral sensory copy, 3D interactive breakdowns, and surgical retargeting.',
      channels: ['3D Web Experience', 'Editorial Campaign', 'Conversion Pipeline', 'Performance Media'],
      metricsLabel: 'Conversion model (Illustrative)',
      metricsContext: 'Hypothetical 42% decrease in cart abandonment via frictionless checkout design.',
      palette: ['#FF9E2C', '#FF2E93', '#08080A'],
      badge: 'Concept project',
      photoKey: 'product-aeris',
    },
    {
      id: 'velox-logistics',
      title: 'VELOX',
      clientType: 'Autonomous Freight Network',
      category: 'Search & Thought Leadership',
      year: '2026',
      tagline: 'Orchestrating supply chains in real time.',
      description: 'Establishing topical dominance for an autonomous freight corridor company among enterprise supply-chain executives.',
      challenge: 'Zero organic discoverability for enterprise queries with $400+ CPCs in traditional search engines.',
      strategy: 'Developed a real-time data observatory and 24 authoritative technical papers mapping maritime bottlenecks.',
      channels: ['Topical Authority SEO', 'Executive Substack', 'Data Visualization', 'Account-Based Media'],
      metricsLabel: 'Topical reach (Illustrative)',
      metricsContext: 'Targeted top 1% enterprise supply chain search volume capture.',
      palette: ['#FF2E93', '#8A2BE2', '#101013'],
      badge: 'Concept project',
      photoKey: 'product-velox',
    },
    {
      id: 'kinetix-health',
      title: 'KINETIX',
      clientType: 'Longevity & Cellular Diagnostics',
      category: 'Full-Funnel Acquisition',
      year: '2026',
      tagline: 'Biomarkers decoded into daily momentum.',
      description: 'A holistic subscriber growth flywheel translating clinical blood biomarker panels into actionable health rituals.',
      challenge: 'High customer acquisition costs due to medical skepticism and complex test kits requiring behavioral commitment.',
      strategy: 'Demystified lab metrics via visual storytelling, progressive onboarding quizzes, and retention email loops.',
      channels: ['Interactive Diagnostic Quiz', 'Retention Architecture', 'Performance Creative', 'Influencer Seed Kits'],
      metricsLabel: 'Engagement loop (Illustrative)',
      metricsContext: 'Simulated 68% quiz completion rate and 2.1x referral coefficient in beta test model.',
      palette: ['#8A2BE2', '#3D2BFF', '#08080A'],
      badge: 'Concept project',
      photoKey: 'product-kinetix',
    },
    {
      id: 'numen-space',
      title: 'NUMEN',
      clientType: 'Zero-Gravity Manufacturing',
      category: 'Narrative & Capital Campaign',
      year: '2025',
      tagline: 'Purity of materials forged in vacuum.',
      description: 'Shaping the narrative for orbital crystal synthesis to secure tier-1 institutional defense and optical buyers.',
      challenge: 'High-concept deep tech difficult for non-technical investors and enterprise buyers to evaluate quickly.',
      strategy: 'Cinema-grade WebGL documentation and crisp editorial whitepapers translating orbital physics into economic upside.',
      channels: ['Cinema Direction', 'Bespoke Pitch Systems', 'Interactive Telemetry', 'Private Keynotes'],
      metricsLabel: 'Investor dwell time (Illustrative)',
      metricsContext: 'Illustrative demonstration of high-conviction executive engagement.',
      palette: ['#3D2BFF', '#FF3B1F', '#08080A'],
      badge: 'Concept project',
      photoKey: 'product-numen',
    },
  ] as Project[],
  industries: [
    {
      id: 'ecommerce',
      name: 'E-commerce & DTC',
      lead: 'Turning catalog commoditization into brand equity.',
      narrative: 'We rebuild the acquisition funnel from product page friction to high-velocity retention loops, cutting blended customer acquisition costs while driving lifetime repurchase rates.',
      channels: ['Meta Creative Sprint', 'Shopify CRO Systems', 'Retention SMS/Email', 'Google Shopping Arbitrage'],
      photoKey: 'design-laptop',
    },
    {
      id: 'real-estate',
      name: 'Real Estate & Built Environment',
      lead: 'Architectural distinction translated into pre-leasing velocity.',
      narrative: 'High-end developments require emotional gravity before ground is broken. We produce immersive 3D digital sales galleries and targeted family office campaigns.',
      channels: ['Digital Sales Galleries', 'High-Net-Worth Retargeting', 'Search Authority', 'Private Invitations'],
      photoKey: 'architecture-glass',
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Biotech',
      lead: 'Translating deep science into patient trust.',
      narrative: 'Complex diagnostic innovations require clinical credibility combined with human empathy. We bridge the gap between regulatory precision and consumer adoption.',
      channels: ['Scientific Content Clustering', 'Interactive Diagnostic Flows', 'Compliance Paid Media', 'Physician Portals'],
      photoKey: 'product-kinetix',
    },
    {
      id: 'education',
      name: 'Education & Executive Learning',
      lead: 'Positioning intellectual capital at the frontier of career mobility.',
      narrative: 'We help premium academies and executive fellowships communicate transformative curriculum value, driving qualified application velocity without discounting.',
      channels: ['Alumni Case Observatories', 'Search Intent Dominance', 'Cohort Enrollment Funnels', 'LinkedIn Thought Engines'],
      photoKey: 'education-lecture',
    },
    {
      id: 'hospitality',
      name: 'Hospitality & Luxury',
      lead: 'Atmospheric storytelling that commands premium RevPAR.',
      narrative: 'Experiential boutique hotels and culinary flagships require magnetic cultural prestige. We craft digital anticipation and high-conversion direct booking engines.',
      channels: ['Cinematic Brand Films', 'Influencer Residency Systems', 'Direct Booking Optimization', 'Editorial Newsletters'],
      photoKey: 'hospitality-luxury',
    },
    {
      id: 'fashion',
      name: 'Fashion & Lifestyle',
      lead: 'Seasonal momentum engineered for year-round desire.',
      narrative: 'From runway drop mechanics to sustainable supply chain transparency, we build visual campaigns that turn casual browsers into ardent brand advocates.',
      channels: ['Drop Calendar Engines', 'Vertical Video Direction', 'Community Discord/VIP', 'Dynamic Retargeting'],
      photoKey: 'fashion-editorial',
    },
    {
      id: 'b2b-enterprise',
      name: 'B2B & Enterprise Tech',
      lead: 'Demolishing boring enterprise software marketing.',
      narrative: 'Enterprise buyers are still humans seeking clarity and risk reduction. We position complex infrastructure with visceral clarity, driving high-contract inbound pipeline.',
      channels: ['Account-Based Advertising', 'Topical Whitepaper Clusters', 'Executive Podcasts', 'Conversion Web Architecture'],
      photoKey: 'b2b-boardroom',
    },
  ] as IndustryItem[],
  approach: [
    {
      step: '01',
      title: 'Listen',
      subhead: 'We start with your business, not a template.',
      description: 'Before touching a pixel or a media budget, we interrogate the fundamental mechanics: unit economics, real buyer objections, operational choke points, and true differentiators.',
      detail: 'No preconceived playbooks. We map where your brand currently leaks attention and revenue.',
      photoKey: 'strategy-collab',
    },
    {
      step: '02',
      title: 'Map',
      subhead: 'Audience, market, and a plan with priorities.',
      description: 'We construct your brand wedge: the single psychological territory you can own with zero ambiguity, paired with an exact distribution and keyword architecture.',
      detail: 'Clear priorities, budget modeling, timeline milestones, and verifiable kill-criteria.',
      photoKey: 'whiteboard-session',
    },
    {
      step: '03',
      title: 'Make',
      subhead: 'Creative and campaigns built to work together.',
      description: 'We craft the assets that turn heads: bespoke landing pages, motion collateral, search clusters, and high-tempo ad creatives built to stop scrolling fingers in their tracks.',
      detail: 'Every creative element is engineered for resonance, technical speed, and conversion intent.',
      photoKey: 'studio-production',
    },
    {
      step: '04',
      title: 'Grow',
      subhead: 'Measure, learn, and refine, continuously.',
      description: 'Launch is day zero. We monitor real visitor journeys, run disciplined A/B testing on messaging and funnels, and scale the media channels delivering profitable return.',
      detail: 'Weekly telemetry reviews, rapid creative iteration, and persistent margin expansion.',
      photoKey: 'analytics-dashboard',
    },
  ] as ApproachStep[],
  whyUsPillars: [
    {
      number: '01',
      title: 'Strategy First',
      tagline: 'No creative without economic logic.',
      description: 'We refuse to launch campaigns to win agency trophies. Every pixel, keyword cluster, and ad sprint is reverse-engineered from your gross margins and buyer psychology.',
      photoKey: 'strategy-collab',
    },
    {
      number: '02',
      title: 'Craft That Gets Noticed',
      tagline: 'When everything looks identical, distinction is defensive armor.',
      description: 'Stock templates produce stock revenue. We blend cinema-grade visual direction with bespoke WebGL interactions to ensure your brand is impossible to ignore in crowded feeds.',
      photoKey: 'studio-production',
    },
    {
      number: '03',
      title: 'Honest Reporting',
      tagline: 'Clean attribution, zero vanity metrics.',
      description: 'We don’t report impressions or vague engagement scores. You receive transparent weekly telemetry showing direct pipeline contribution, blended CAC, and customer lifetime value.',
      photoKey: 'analytics-dashboard',
    },
    {
      number: '04',
      title: 'One Accountable Team',
      tagline: 'Senior practitioners only. No bait-and-switch handoffs.',
      description: 'You work directly with senior directors and technical engineers who actually build and execute your work. No junior account managers buffering real communication.',
      photoKey: 'hands-craft',
    },
  ],
  toolkitChannels: [
    { category: 'Search Dominance', channels: ['Google Search Authority', 'AI Overviews (LLM Recall)', 'Technical Semantic Indexing', 'Local Pack & Knowledge Graphs'] },
    { category: 'Paid Performance', channels: ['Meta Dynamic Creative Sprints', 'Google Performance Max', 'LinkedIn Account-Based Ads', 'YouTube Brand Awareness'] },
    { category: 'Conversion Architecture', channels: ['Bespoke WebGL Landing Pages', 'Bayesian A/B Testing Suites', 'Mobile Checkout Optimization', 'First-Party Server Tracking'] },
    { category: 'Retention & CRM', channels: ['Klaviyo Customer Journeys', 'Substack Editorial Engines', 'Behavioral SMS Triggers', 'Churn Prevention Frameworks'] },
  ],
  packages: [
    {
      id: 'launch-sprint',
      name: 'Launch Sprint',
      badge: '4-6 WEEKS',
      timeframe: 'Concentrated 30-Day Sprint',
      description: 'Designed for new category entries, major product drops, or complete brand pivots requiring rapid market velocity.',
      deliverables: [
        'Strategic wedge positioning & core narrative manifesto',
        'Bespoke high-conversion landing page (designed & developed)',
        '30-day initial paid media & creative testing sprint',
        'Topical search foundation & baseline attribution setup',
      ],
      commitment: 'Single project milestone fee',
      ctaText: 'Request a Sprint Proposal',
    },
    {
      id: 'growth-partnership',
      name: 'Growth Partnership',
      badge: 'FLAGSHIP RETAINER',
      timeframe: 'Ongoing Monthly Engagement',
      description: 'Our core engagement model: serving as your dedicated strategic growth, media management, and creative execution powerhouse.',
      deliverables: [
        'End-to-end paid media orchestration across Meta, Google & LinkedIn',
        'Continuous weekly creative sprint (video, motion, statics, copy)',
        'Ongoing technical SEO Topical Authority production',
        'Weekly live telemetry reviews & monthly executive roadmap',
      ],
      commitment: 'Monthly retainer with clear 90-day review cycles',
      ctaText: 'Apply for Partnership',
    },
    {
      id: 'specialist-support',
      name: 'Specialist Support',
      badge: 'ADVISORY & AUDIT',
      timeframe: 'Targeted Advisory Scope',
      description: 'Deep-dive tactical intervention for in-house teams seeking outside expertise in positioning, tracking, or creative overhaul.',
      deliverables: [
        'Comprehensive marketing & conversion architecture audit',
        'Custom cookieless first-party tracking blueprint',
        'Creative direction overhaul & executive workshop',
        'Direct async access to senior studio directors',
      ],
      commitment: 'Fixed advisory sprint',
      ctaText: 'Schedule an Advisory Audit',
    },
  ] as PackageTier[],
  faq: [
    {
      question: 'How quickly can we expect to see tangible results?',
      answer: 'For paid performance campaigns and CRO improvements, initial behavioral data and early traction typically emerge within the first 14 to 21 days. For foundational SEO authority and organic brand compounding, measurable search visibility gains generally mature over 60 to 90 days as topical authority compounds.',
    },
    {
      question: 'How do you structure reporting and communication?',
      answer: 'We provide a live, real-time telemetry dashboard showing verified pipeline contribution and blended CAC rather than vanity metrics. In addition, we host weekly 30-minute syncs with your leadership team and maintain a dedicated Slack/Teams channel for continuous async collaboration.',
    },
    {
      question: 'How do you price your engagements?',
      answer: 'We do not use cookie-cutter price sheets because scopes vary significantly. Our engagements are structured around clear commercial deliverables: fixed milestone fees for Launch Sprints and predictable monthly retainers for ongoing Growth Partnerships. We provide itemized proposals with zero hidden markups.',
    },
    {
      question: 'What types of businesses do you work best with?',
      answer: 'We partner with high-ambition founders, enterprise marketing leads, and challenger brands with proven product-market fit looking to break through commoditization. We operate best with clients who value strategic courage, craft, and honest data over consensus-driven bureaucracy.',
    },
    {
      question: 'What do you require from our team to kick off?',
      answer: 'During week one, we need access to historical analytics, ad accounts, and buyer feedback, along with a 90-minute immersion interview with your core founders or product specialists. After that, we handle the heavy lifting while respecting your team’s operating bandwidth.',
    },
    {
      question: 'Do you work on equity or pure performance compensation?',
      answer: 'We primarily work on structured milestone and retainer fees to align incentives and guarantee senior focus. In select high-conviction cases where we have direct governance over full-funnel mechanics, we consider hybrid models with a performance incentive component.',
    },
  ] as FaqItem[],
  valuePoints: [
    {
      id: 'positioning',
      title: 'Clearer positioning',
      summary: 'When what you do is immediately obvious, you stop competing on price and start commanding attention.',
    },
    {
      id: 'compounding',
      title: 'Attention that compounds',
      summary: 'Tactics fade; narrative infrastructure and topical search authority accumulate enterprise value month after month.',
    },
    {
      id: 'clicks',
      title: 'Fewer wasted clicks',
      summary: 'No vanity traffic. We align user intent with frictionless conversion paths so media dollars deliver genuine pipeline.',
    },
    {
      id: 'data',
      title: 'Decisions backed by data',
      summary: 'Ruthless clarity on what actually moves the dial: cohort retention, blend CAC, and real customer lifetime value.',
    },
  ],
}
