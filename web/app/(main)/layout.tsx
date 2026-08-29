import Link from 'next/link'
import { Search, LayoutDashboard, MessageSquare, User, Plus } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'

const NAV_ITEMS = [
  { href: '/search',    icon: Search,          label: 'Search'   },
  { href: '/dashboard', icon: LayoutDashboard,  label: 'My sits'  },
  { href: '/create-listing', icon: Plus,        label: 'Post sit' },
  { href: '/inbox',     icon: MessageSquare,    label: 'Inbox'    },
  { href: '/profile/edit', icon: User,          label: 'Profile'  },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Page content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-haven-sand/40 px-2 py-1 z-40">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-haven-gray hover:text-haven-teal hover:bg-haven-teal-pale/50 transition-all"
            >
              {item.href === '/create-listing' ? (
                <div className="h-9 w-9 rounded-full bg-haven-teal flex items-center justify-center mb-0.5 shadow-haven">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
              ) : (
                <item.icon className="h-5 w-5" />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
