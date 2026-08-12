import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { posts } from '@/lib/blog'

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts[params.slug]
  if (!post) return { title: 'Post not found' }
  return {
    title: `${post.title} | Haven Blog`,
    description: post.excerpt,
  }
}

// Inline markdown: **bold**, *italic*, [text](url). Bold runs first so the
// italic pattern can't consume half of a ** pair.
function inline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-haven-teal font-semibold hover:underline">$1</a>')
}

const isBullet = (line: string) => line.startsWith('- ') && !line.startsWith('- [ ]')

function renderContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (isBullet(line)) {
      // Consume the whole run so the items share one <ul> parent
      const start = i
      const items: string[] = []
      while (i < lines.length && isBullet(lines[i])) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={start} className="list-disc list-outside ml-6 mb-4">
          {items.map((item, n) => (
            <li key={n} className="text-haven-gray mb-2"
              dangerouslySetInnerHTML={{ __html: inline(item) }}
            />
          ))}
        </ul>
      )
      continue
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="font-display text-2xl font-bold text-haven-navy mt-10 mb-4">
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} className="font-semibold text-haven-navy mb-2">
          {line.replace(/\*\*/g, '')}
        </p>
      )
    } else if (line.startsWith('- [ ]')) {
      elements.push(
        <div key={i} className="flex items-start gap-3 mb-2">
          <span className="mt-1 w-4 h-4 border-2 border-haven-sand rounded flex-shrink-0" />
          <span className="text-haven-gray"
            dangerouslySetInnerHTML={{ __html: inline(line.replace('- [ ] ', '')) }}
          />
        </div>
      )
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="border-haven-sand my-10" />)
    } else if (line.trim() === '') {
      // skip
    } else {
      elements.push(
        <p key={i} className="text-haven-gray leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: inline(line) }}
        />
      )
    }
    i++
  }

  return elements
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts[params.slug]
  if (!post) notFound()

  const otherPosts = Object.entries(posts)
    .filter(([slug]) => slug !== params.slug)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-haven-cream">
      {/* Hero */}
      <section className="bg-haven-navy py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-haven-teal text-sm font-semibold hover:underline mb-6 inline-block">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-haven-teal uppercase tracking-wide bg-haven-teal/20 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-white/50 text-sm">{post.date}</span>
            <span className="text-white/50 text-sm">{post.readTime}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Emoji banner */}
      <div className="bg-haven-teal/10 h-40 flex items-center justify-center text-8xl">
        {post.emoji}
      </div>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xl text-haven-gray leading-relaxed mb-8 font-medium">
          {post.excerpt}
        </p>
        <div className="prose-haven">
          {renderContent(post.content)}
        </div>
      </section>

      {/* More posts */}
      <section className="bg-white border-t border-haven-sand py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-haven-navy mb-8">More from the Haven Blog</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {otherPosts.map(([slug, p]) => (
              <Link key={slug} href={`/blog/${slug}`} className="group">
                <div className="bg-haven-cream rounded-2xl overflow-hidden border border-haven-sand hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="bg-haven-teal/10 h-28 flex items-center justify-center text-5xl">
                    {p.emoji}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-haven-teal uppercase tracking-wide">{p.category}</span>
                    <h3 className="font-bold text-haven-navy mt-1 mb-2 group-hover:text-haven-teal transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <span className="text-xs text-haven-gray">{p.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
