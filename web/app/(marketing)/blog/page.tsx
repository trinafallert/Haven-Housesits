import Link from 'next/link'
import { Metadata } from 'next'
import { postList, categories } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog | Haven Housesits',
  description: 'Tips, stories, and guides for house sitters and pet owners.',
}

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
          {postList.map((post) => (
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
