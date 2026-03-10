export type PostCategory = 'Guide' | 'Comparison' | 'Tips' | 'Earnings'

export interface PostMeta {
  slug: string
  title: string
  description: string
  publishedAt: string
  readingTime: number
  category: PostCategory
  tags: string[]
  author: {
    name: string
    title: string
  }
}

export const allPosts: PostMeta[] = [
  {
    slug: 'how-to-get-your-first-housesit',
    title: "How to Get Your First Housesit: A Complete Beginner's Guide",
    description:
      "New to housesitting? Learn exactly how to land your first housesit — from building a standout profile to writing applications that owners actually respond to.",
    publishedAt: '2026-02-10',
    readingTime: 8,
    category: 'Guide',
    tags: ['beginners', 'profile tips', 'applications', 'getting started'],
    author: { name: 'Trina Fallert', title: 'Founder & CEO, Haven Housesits' },
  },
  {
    slug: 'trustedhousesitters-vs-haven',
    title: 'TrustedHousesitters vs Haven Housesits (2026): An Honest Comparison',
    description:
      "Thinking about switching from TrustedHousesitters? We compare pricing, paid sits access, application limits, and support so you can decide for yourself.",
    publishedAt: '2026-02-18',
    readingTime: 6,
    category: 'Comparison',
    tags: ['TrustedHousesitters', 'comparison', 'platform review'],
    author: { name: 'Trina Fallert', title: 'Founder & CEO, Haven Housesits' },
  },
  {
    slug: 'paid-house-sitting-jobs',
    title: 'Paid House Sitting: How to Find Sits That Pay You to Travel',
    description:
      "Learn how paid house sitting works, what you can realistically earn, and where to find paid housesitting jobs worldwide — including sits you can browse by destination.",
    publishedAt: '2026-02-25',
    readingTime: 7,
    category: 'Earnings',
    tags: ['paid sits', 'earn money housesitting', 'travel income'],
    author: { name: 'Trina Fallert', title: 'Founder & CEO, Haven Housesits' },
  },
  {
    slug: 'house-sitter-checklist',
    title: "The House Sitter's Complete Checklist (Before, During & After)",
    description:
      "Save this checklist before your next sit. Everything a house sitter needs to do — from the week before you arrive to the moment you hand back the keys.",
    publishedAt: '2026-03-03',
    readingTime: 5,
    category: 'Tips',
    tags: ['checklist', 'preparation', 'house sitting tips'],
    author: { name: 'Trina Fallert', title: 'Founder & CEO, Haven Housesits' },
  },
]

export function getPost(slug: string): PostMeta | undefined {
  return allPosts.find((p) => p.slug === slug)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const categoryStyle: Record<PostCategory, string> = {
  Guide:      'bg-haven-teal-pale text-haven-teal-dark',
  Comparison: 'bg-haven-navy/10 text-haven-navy',
  Tips:       'bg-amber-50 text-amber-700',
  Earnings:   'bg-green-50 text-green-700',
}
