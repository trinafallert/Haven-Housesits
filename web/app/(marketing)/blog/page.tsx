import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { allPosts, formatDate, categoryStyle, type PostCategory } from '@/lib/blog'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Blog — Haven Housesits',
  description:
    'Practical guides, tips, and advice for house sitters and homeowners. Learn how to get your first housesit, find paid sits, and make every stay a great one.',
}

const featuredPost = allPosts[allPosts.length - 1]
const otherPosts   = allPosts.slice(0, allPosts.length - 1).reverse()

function CategoryPill({ category }: { category: PostCategory }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${categoryStyle[category]}`}>
      {category}
    </span>
  )
}

export default function BlogIndexPage() {
  return (
    <div className="bg-haven-cream min-h-screen">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="py-20 container-haven text-center">
        <Badge variant="teal" className="mb-6">Haven Blog</Badge>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-haven-navy mb-4">
          Guides for sitters &amp; owners
        </h1>
        <p className="text-haven-gray text-xl max-w-2xl mx-auto">
          Practical advice on landing sits, earning from housesitting, and being the sitter that owners request again and again.
        </p>
      </section>

      {/* ── FEATURED POST ──────────────────────────────────────────── */}
      <section className="container-haven pb-12">
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group block bg-white rounded-3xl border border-haven-sand/60 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden max-w-4xl mx-auto"
        >
          <div className="p-10 md:p-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold text-haven-teal-dark uppercase tracking-wide">Featured</span>
              <span className="text-haven-sand-dark">·</span>
              <CategoryPill category={featuredPost.category} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-haven-navy mb-4 group-hover:text-haven-teal transition-colors">
              {featuredPost.title}
            </h2>
            <p className="text-haven-gray leading-relaxed mb-6 max-w-2xl">
              {featuredPost.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-haven-gray-light">
                <span>{featuredPost.author.name}</span>
                <span>·</span>
                <span>{formatDate(featuredPost.publishedAt)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featuredPost.readingTime} min read
                </span>
              </div>
              <span className="flex items-center gap-1 text-haven-teal font-semibold text-sm group-hover:gap-2 transition-all">
                Read <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── POSTS GRID ─────────────────────────────────────────────── */}
      <section className="container-haven pb-24">
        <h2 className="font-display text-2xl font-bold text-haven-navy mb-8 max-w-4xl mx-auto">
          All posts
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {otherPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-3xl border border-haven-sand/60 shadow-card hover:shadow-card-hover transition-all duration-200 p-8"
            >
              <div className="mb-4">
                <CategoryPill category={post.category} />
              </div>
              <h3 className="font-display text-xl font-bold text-haven-navy mb-3 group-hover:text-haven-teal transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-haven-gray text-sm leading-relaxed mb-6 line-clamp-3">
                {post.description}
              </p>
              <div className="flex items-center justify-between text-xs text-haven-gray-light">
                <div className="flex items-center gap-3">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min
                  </span>
                </div>
                <span className="flex items-center gap-1 text-haven-teal font-semibold group-hover:gap-2 transition-all">
                  Read <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
