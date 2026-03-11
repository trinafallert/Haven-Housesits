import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Haven Housesits',
  description: 'Tips, stories, and guides for house sitters and pet owners.',
}

const posts = [
  {
    slug: 'how-house-sitting-works',
    title: 'How House Sitting Works: A Complete Guide for Beginners',
    excerpt: 'Everything you need to know about house sitting — from finding your first sit to building a five-star reputation.',
    category: 'Getting Started',
    date: 'March 5, 2026',
    readTime: '6 min read',
    emoji: '🏠',
  },
  {
    slug: 'tips-for-pet-owners',
    title: '8 Tips for Pet Owners Using House Sitters for the First Time',
    excerpt: 'Leaving your pets with someone new can feel daunting. Here\'s how to find the right sitter and set everyone up for success.',
    category: 'Pet Owners',
    date: 'March 3, 2026',
    readTime: '5 min read',
    emoji: '🐾',
  },
  {
    slug: 'paid-vs-free-sits',
    title: 'Paid Sits vs. Free Sits: Which Is Right for You?',
    excerpt: 'Haven offers both free and paid house sitting opportunities. We break down the pros, cons, and when each makes sense.',
    category: 'Sitters',
    date: 'February 28, 2026',
    readTime: '4 min read',
    emoji: '💰',
  },
  {
    slug: 'build-a-great-sitter-profile',
    title: 'How to Build a Sitter Profile That Gets Accepted',
    excerpt: 'Your profile is your first impression. Learn what pet owners actually look for when choosing a house sitter.',
    category: 'Sitters',
    date: 'February 24, 2026',
    readTime: '5 min read',
    emoji: '⭐',
  },
  {
    slug: 'house-sitting-packing-list',
    title: 'The Ultimate House Sitting Packing List',
    excerpt: 'From emergency vet numbers to pet food storage — everything you should bring (and ask about) before your sit begins.',
    category: 'Tips & Tricks',
    date: 'February 20, 2026',
    readTime: '4 min read',
    emoji: '🎒',
  },
  {
    slug: 'haven-vs-trustedhousesitters',
    title: 'Haven vs. TrustedHouseSitters: What\'s Different?',
    excerpt: 'We\'re a new kind of house sitting platform. Here\'s what makes Haven unique — and why sitters and owners are making the switch.',
    category: 'About Haven',
    date: 'February 15, 2026',
    readTime: '3 min read',
    emoji: '🌿',
  },
]

const categories = ['All', 'Getting Started', 'Pet Owners', 'Sitters', 'Tips & Tricks', 'About Haven']

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-haven-cream">
      {/* Hero */}
      <section className="bg-haven-navy py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-haven-teal font-semibold mb-3 tracking-wide uppercase text-sm">Haven Blog</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Tips, stories & guides
          </h1>
          <p className="text-white/70 text-lg">
            Everything you need to house sit smarter, find better sitters, and travel with peace of mind.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-haven-sand bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors
                ${cat === 'All'
                  ? 'bg-haven-teal text-white'
                  : 'bg-haven-sand/50 text-haven-navy hover:bg-haven-teal/10'
                }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-2xl overflow-hidden border border-haven-sand hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full flex flex-col">
                {/* Emoji banner */}
                <div className="bg-haven-teal/10 h-44 flex items-center justify-center text-7xl">
                  {post.emoji}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-haven-teal uppercase tracking-wide bg-haven-teal/10 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-haven-gray">{post.readTime}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-haven-navy mb-2 group-hover:text-haven-teal transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-haven-gray text-sm leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-haven-gray">{post.date}</span>
                    <span className="text-haven-teal text-sm font-semibold group-hover:underline">Read more →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-haven-navy py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Stay in the loop 🌿</h2>
          <p className="text-white/70 mb-8">Get new articles, sit tips, and Haven updates delivered to your inbox.</p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-haven-navy font-medium focus:outline-none focus:ring-2 focus:ring-haven-teal"
            />
            <button
              type="submit"
              className="bg-haven-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-haven-teal-dark transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
