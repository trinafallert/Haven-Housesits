import Link from 'next/link'
import { Home, Instagram, Twitter, Facebook } from 'lucide-react'

const links = {
  Sitters: [
    { label: 'Find a sit',          href: '/search' },
    { label: 'Paid sits',           href: '/paid-sits' },
    { label: 'Create profile',      href: '/signup?role=sitter' },
    { label: 'Sitter resources',    href: '/resources/sitters' },
    { label: 'Sit journal',         href: '/journal' },
  ],
  'Home Owners': [
    { label: 'Post a sit',          href: '/create-listing' },
    { label: 'Browse sitters',      href: '/sitters' },
    { label: 'Paid sits',           href: '/paid-sits' },
    { label: 'Add-ons',             href: '/addons' },
    { label: 'Owner resources',     href: '/resources/owners' },
  ],
  Company: [
    { label: 'About Haven',         href: '/about' },
    { label: 'How it works',        href: '/how-it-works' },
    { label: 'Pricing',             href: '/pricing' },
    { label: 'Blog',                href: '/blog' },
    { label: 'Careers',             href: '/careers' },
  ],
  Support: [
    { label: 'Help centre',         href: '/help' },
    { label: 'FAQ',                 href: '/faq' },
    { label: 'Safety & trust',      href: '/safety' },
    { label: 'Contact us',          href: '/contact' },
    { label: 'Live chat',           href: '/chat' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-haven-navy text-white">
      <div className="container-haven py-16">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-xl bg-haven-teal flex items-center justify-center">
                <Home className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl">
                Haven <span className="text-haven-teal-light">Housesits</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Connecting trusted home owners with verified sitters worldwide.
              Free sits, paid sits, and everything in between.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <SocialIcon href="https://instagram.com" icon={<Instagram className="h-4 w-4" />} />
              <SocialIcon href="https://twitter.com"   icon={<Twitter   className="h-4 w-4" />} />
              <SocialIcon href="https://facebook.com"  icon={<Facebook  className="h-4 w-4" />} />
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 hover:text-haven-teal-light transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Haven Housesits. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-9 w-9 rounded-xl bg-white/10 hover:bg-haven-teal transition-colors flex items-center justify-center"
    >
      {icon}
    </a>
  )
}
