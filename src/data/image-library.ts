/**
 * Image library — the Finance OS photography shoot, tagged for reuse.
 *
 * Calm, natural-light "advisors at work" imagery that matches the brand's approved photography
 * direction (considered and real, never stock-smiley). Each entry carries a human description
 * (also the <img> alt), descriptive `tags` for filtering, and `use` hints for where it fits —
 * so a person OR an AI agent can pick the right image for an asset, funnel, website page or blog.
 *
 * Files live at /images/library/<id>.jpg (optimised JPEG, ~1400px, 3:2 landscape). Add an image
 * by dropping a JPEG there and appending an entry below; the Image Library section renders and
 * filters this list directly, and IMAGE_LIBRARY_TAGS (derived) drives the filter chips.
 */
export interface LibraryImage {
  /** file id — matches /images/library/<id>.jpg */
  id: string
  title: string
  /** one-line description; used as the image alt text and as the AI-readable caption */
  alt: string
  /** descriptive tags for filtering/organising (setting · people · subject · mood · light) */
  tags: string[]
  /** where this image fits — hero, feature, testimonial, about, blog, case-study, background… */
  use: string[]
}

export const IMAGE_LIBRARY: LibraryImage[] = [
  { id: 'approachable-executive-office-portrait', title: 'Approachable Executive Portrait', alt: 'Smiling bearded executive in a navy sweater, a soft-focus office behind him.', tags: ['portrait', 'solo', 'professional', 'approachable', 'warm', 'natural-light', 'office'], use: ['testimonial', 'about', 'hero'] },
  { id: 'architectural-consultation-in-sunlit-office', title: 'Sunlit Consultation', alt: 'Two advisors talking over documents at a round table in a sunlit room with sheer curtains.', tags: ['meeting', 'duo', 'consultation', 'sunlit', 'warm', 'planning', 'office'], use: ['feature', 'about', 'case-study'] },
  { id: 'blueprint-collaboration-in-a-sunlit-lounge', title: 'Blueprint Collaboration', alt: 'Overhead view of two people reviewing plans at a desk in a loft-style lounge.', tags: ['collaboration', 'duo', 'planning', 'documents', 'overhead', 'lounge', 'warm'], use: ['feature', 'blog', 'case-study'] },
  { id: 'brunette-businesswoman-crossing-a-sunlit-office', title: 'Businesswoman in Motion', alt: 'Woman in a navy suit walking through an office carrying a laptop, with motion blur.', tags: ['solo', 'candid', 'professional', 'motion', 'warm', 'office', 'natural-light'], use: ['hero', 'feature', 'about'] },
  { id: 'business-call-in-a-modern-lounge', title: 'Call in a Modern Lounge', alt: 'Man in a navy suit taking a phone call at a counter, framed by foliage.', tags: ['solo', 'call', 'professional', 'foliage', 'bright', 'lounge'], use: ['feature', 'blog', 'contact'] },
  { id: 'candid-office-brainstorm-meeting', title: 'Candid Brainstorm', alt: 'Three colleagues around a low table with a tablet in a dim, modern office.', tags: ['meeting', 'group', 'brainstorm', 'candid', 'moody', 'discussion', 'office'], use: ['feature', 'case-study', 'about'] },
  { id: 'candid-office-conversation', title: 'Candid Conversation', alt: 'A smiling man in conversation with two colleagues across a table.', tags: ['conversation', 'group', 'candid', 'warm', 'discussion', 'meeting', 'office'], use: ['testimonial', 'about', 'feature'] },
  { id: 'collaborative-conversation-in-the-office-lounge', title: 'Lounge Collaboration', alt: 'A man and woman talking over a laptop in grey lounge chairs among plants.', tags: ['collaboration', 'duo', 'conversation', 'lounge', 'calm', 'planning'], use: ['feature', 'about', 'blog'] },
  { id: 'collaborative-meeting-over-office-documents', title: 'Meeting Over Documents', alt: 'Three colleagues leaning over documents and a laptop at a desk by a window.', tags: ['collaboration', 'group', 'documents', 'planning', 'natural-light', 'meeting'], use: ['feature', 'case-study', 'hero'] },
  { id: 'collaborative-modern-office-workspace', title: 'Modern Workspace', alt: 'Three people working at monitors, one standing to help, in a dark modern office.', tags: ['working', 'group', 'workspace', 'screens', 'collaboration', 'focused'], use: ['feature', 'blog', 'case-study'] },
  { id: 'collaborative-moment-with-red-pencil', title: 'A Moment of Agreement', alt: 'Woman in a white turtleneck smiling in conversation, a red pencil in hand.', tags: ['conversation', 'duo', 'candid', 'warm', 'portrait', 'planning'], use: ['testimonial', 'about', 'feature'] },
  { id: 'elegant-olive-conference-room', title: 'Olive Conference Room', alt: 'An empty conference room with olive corduroy chairs, a long table and sheer-lit curtains.', tags: ['conference-room', 'no-people', 'interior', 'olive', 'warm', 'sunlit'], use: ['background', 'about', 'feature'] },
  { id: 'focused-executive-in-a-sunlit-boardroom', title: 'Boardroom with a View', alt: 'Executive standing at a boardroom table against floor-to-ceiling windows and a city skyline.', tags: ['solo', 'boardroom', 'city-view', 'focused', 'natural-light', 'professional'], use: ['hero', 'about', 'feature'] },
  { id: 'focused-work-in-a-cosy-lounge', title: 'Focused in the Lounge', alt: 'Woman working on a laptop on a grey banquette, warm bokeh around her.', tags: ['solo', 'lounge', 'working', 'focused', 'warm', 'laptop'], use: ['feature', 'blog', 'about'] },
  { id: 'focused-work-in-a-sunlit-home-office', title: 'Sunlit Home Office', alt: 'Man in a blue shirt working at a laptop in a plant-filled home office.', tags: ['solo', 'home-office', 'working', 'focused', 'natural-light', 'remote-work'], use: ['feature', 'blog', 'remote-work'] },
  { id: 'focused-work-with-takeaway-coffee', title: 'Focused with Coffee', alt: 'Man in a dark tee working at a laptop in a bright, minimal room with a coffee.', tags: ['solo', 'working', 'focused', 'coffee', 'bright', 'laptop'], use: ['feature', 'blog', 'about'] },
  { id: 'focused-workstation-moment', title: 'At the Workstation', alt: 'Man in a blue shirt at a desktop monitor in a dark, modern workspace.', tags: ['solo', 'workstation', 'working', 'focused', 'screens', 'modern'], use: ['feature', 'blog', 'product'] },
  { id: 'golden-hour-coastal-workspace', title: 'Coastal Golden Hour', alt: 'Man working at an outdoor balcony desk with a laptop and monitor over a coastal sunset.', tags: ['solo', 'coastal', 'golden-hour', 'remote-work', 'outdoor', 'workspace'], use: ['hero', 'blog', 'lifestyle'] },
  { id: 'modern-lounge-conversation', title: 'Lounge Conversation', alt: 'A man and woman talking in armchairs by a city-view window with plants.', tags: ['duo', 'lounge', 'conversation', 'city-view', 'calm', 'meeting'], use: ['feature', 'about', 'testimonial'] },
  { id: 'moody-silhouettes-in-a-glass-walled-meeting', title: 'Moody Meeting', alt: 'Three silhouetted figures in a foggy glass-walled meeting room with a warm glow.', tags: ['group', 'meeting', 'moody', 'atmospheric', 'silhouette', 'discussion'], use: ['hero', 'background', 'case-study'] },
  { id: 'professional-office-meeting-discussion', title: 'Office Discussion', alt: 'Two men in discussion at a table in a bright, glass-walled modern office.', tags: ['duo', 'meeting', 'discussion', 'glass', 'bright', 'professional'], use: ['feature', 'about', 'case-study'] },
  { id: 'quiet-office-by-the-city-window', title: 'Quiet City Office', alt: 'Woman with a tablet standing by a high-rise window overlooking the city.', tags: ['solo', 'office', 'city-view', 'calm', 'tablet', 'quiet'], use: ['hero', 'about', 'feature'] },
  { id: 'relaxed-coffee-moment-in-a-leather-chair', title: 'Coffee in a Leather Chair', alt: 'Man relaxing in a tan leather chair with a coffee, warm bokeh around him.', tags: ['solo', 'relaxed', 'coffee', 'lounge', 'warm', 'candid'], use: ['feature', 'blog', 'about'] },
  { id: 'sunlit-office-lounge-with-eyeglasses', title: 'Sunlit Reading Lounge', alt: 'Man reading papers in an armchair in a sunlit high-rise lounge with a city view.', tags: ['solo', 'lounge', 'reading', 'city-view', 'sunlit', 'calm'], use: ['hero', 'feature', 'about'] },
  { id: 'thoughtful-executive-in-modern-office', title: 'Thoughtful Executive', alt: 'Executive in a suit studying a laptop, hand on chin, in a modern office with plants.', tags: ['solo', 'executive', 'thoughtful', 'laptop', 'focused', 'modern'], use: ['about', 'hero', 'feature'] },
  { id: 'thoughtful-meeting-in-soft-focus', title: 'Listening Closely', alt: 'Grey-haired man in navy listening thoughtfully, a colleague soft-focus in the foreground.', tags: ['solo', 'portrait', 'thoughtful', 'meeting', 'warm', 'listening'], use: ['testimonial', 'about', 'feature'] },
  { id: 'thoughtful-moment-at-the-desk', title: 'Thoughtful at the Desk', alt: 'Woman at an iMac, hand on chin, looking off thoughtfully in a warm office.', tags: ['solo', 'desk', 'thoughtful', 'working', 'warm', 'focused'], use: ['about', 'feature', 'testimonial'] },
  { id: 'thoughtful-phone-call-in-the-studio', title: 'Studio Phone Call', alt: 'Man on a phone call walking through a wood-panelled studio office framed by foliage.', tags: ['solo', 'call', 'studio', 'calm', 'candid', 'foliage'], use: ['feature', 'blog', 'contact'] },
  { id: 'thoughtful-portrait-by-the-screen', title: 'Portrait by the Screen', alt: 'Close portrait of a woman lit by screen glow against a dark background.', tags: ['solo', 'portrait', 'focused', 'screen-glow', 'moody', 'thoughtful'], use: ['about', 'testimonial', 'blog'] },
  { id: 'thoughtful-tech-meeting-amidst-foliage', title: 'Working Amidst Foliage', alt: 'Woman in glasses working on a laptop in a quiet nook framed by plants.', tags: ['solo', 'working', 'laptop', 'foliage', 'calm', 'focused'], use: ['feature', 'blog', 'about'] },
  { id: 'thoughtful-work-in-a-cosy-study', title: 'Cosy Study Session', alt: 'Man in a hoodie working on a laptop on a sofa in a moody, wood-panelled study.', tags: ['solo', 'study', 'working', 'cosy', 'moody', 'remote-work'], use: ['blog', 'feature', 'remote-work'] },
  { id: 'warm-cinematic-office-portrait', title: 'Cinematic Portrait', alt: 'Woman at a desk with a laptop, hand on chin, under a dramatic circular spotlight.', tags: ['solo', 'portrait', 'cinematic', 'warm', 'desk', 'thoughtful'], use: ['hero', 'about', 'testimonial'] },
  { id: 'warm-modern-office-workspace', title: 'Golden-Hour Workspace', alt: 'Man working at a laptop in a bright, open-plan office at golden hour with a coffee.', tags: ['solo', 'workspace', 'working', 'golden-hour', 'open-plan', 'warm'], use: ['hero', 'feature', 'blog'] },
]

/** Every distinct tag + use value across the library, sorted — drives the filter chips. */
export const IMAGE_LIBRARY_TAGS: string[] = [
  ...new Set(IMAGE_LIBRARY.flatMap((i) => [...i.tags, ...i.use])),
].sort()

/** Public path for a library image. */
export const libraryImageSrc = (id: string) => `/images/library/${id}.jpg`
