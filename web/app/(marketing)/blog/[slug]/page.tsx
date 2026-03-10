import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, User } from 'lucide-react'
import { allPosts, getPost, formatDate, categoryStyle, type PostCategory } from '@/lib/blog'
import { Button } from '@/components/ui/button'

// ── Content map ────────────────────────────────────────────────────────────
// Each post's content lives in /content/blog/<slug>.tsx
import HowToGetYourFirstHousesit from '@/content/blog/how-to-get-your-first-housesit'
import TrustedHousesittersVsHaven from '@/content/blog/trustedhousesitters-vs-haven'
import PaidHouseSittingJobs from '@/content/blog/paid-house-sitting-jobs'
import HouseSitterChecklist from '@/content/blog/house-sitter-checklist'

const contentMap: Record<string, React.ComponentType> = {
  'how-to-get-your-first-housesit':   HowToGetYourFirstHousesit,
  'trustedhousesitters-vs-haven':     TrustedHousesittersVsHaven,
  'paid-house-sitting-jobs':          PaidHouseSittingJobs,
  'house-sitter-checklist':           HouseSitterChecklist,
}

// ── Static params ──────────────────────────────────────────────────────────
export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  }
}

function CategoryPill({ category }: { category: PostCategory }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${categoryStyle[category]}`}>
      {category}
    </span>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const Content = contentMap[slug]
  if (!Content) notFound()

  // Related posts: others in same category, or just the previous/next
  const related = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2)

  return (
    <div className="bg-haven-cream min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="py-16 border-b border-haven-sand/40 bg-white">
        <div className="container-haven max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-haven-gray-light mb-8">
            <Link href="/" className="hover:text-haven-teal transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-haven-teal transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-haven-gray truncate">{post.title}</span>
          </nav>

          <div className="mb-5">
            <CategoryPill category={post.category} />
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-haven-navy leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-haven-gray text-lg leading-relaxed mb-8">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-haven-gray-light">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author.name}
            </span>
            <span>·</span>
            <span>{post.author.title}</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-haven max-w-3xl">
          <Content />

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-haven-sand/40">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-haven-gray hover:text-haven-teal transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </div>
        </div>
      </section>

      {/* ── RELATED POSTS ────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-haven-sand/40 bg-white py-16">
          <div className="container-haven max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-haven-navy mb-8">Related posts</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block bg-haven-cream rounded-2xl border border-haven-sand/60 p-6 hover:shadow-card transition-all"
                >
                  <div className="mb-3">
                    <CategoryPill category={p.category} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-haven-navy mb-2 group-hover:text-haven-teal transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <span className="flex items-center gap-1 text-haven-teal text-sm font-semibold">
                    Read <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-haven-navy">
        <div className="container-haven max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Ready to find your perfect sit?
          </h2>
          <p className="text-white/70 mb-8">
            Browse exchange sits, paid sits, and vacant homes — all in one place.
            Three months free to start, no credit card needed.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Get started free
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="secondary" className="border-white/30 text-white hover:bg-white/10">
                Browse sits
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
