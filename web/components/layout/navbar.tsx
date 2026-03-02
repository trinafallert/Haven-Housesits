'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Bell, ChevronDown, Home, Search, MessageSquare, User, LogOut, Settings, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const isLoggedIn = status === 'authenticated'

  return (
    <header className="sticky top-0 z-50 glass border-b border-haven-sand/30">
      <div className="container-haven">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="h-8 w-8 rounded-xl gradient-haven flex items-center justify-center">
              <Home className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-haven-navy">
              Haven <span className="text-haven-teal">Housesits</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-sm font-medium text-haven-gray hover:text-haven-teal transition-colors">
              Find a Sit
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-haven-gray hover:text-haven-teal transition-colors">
              How it Works
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-haven-gray hover:text-haven-teal transition-colors">
              Pricing
            </Link>
            <Link href="/paid-sits" className="text-sm font-medium text-haven-gray hover:text-haven-teal transition-colors">
              Paid Sits
            </Link>
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link href="/inbox" className="relative p-2 rounded-xl hover:bg-haven-gray-pale transition-colors">
                  <MessageSquare className="h-5 w-5 text-haven-gray" />
                </Link>
                <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-haven-gray-pale transition-colors">
                  <Bell className="h-5 w-5 text-haven-gray" />
                </Link>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-haven-gray-pale transition-colors"
                  >
                    <Avatar
                      src={session?.user?.image}
                      firstName={session?.user?.name?.split(' ')[0] || 'U'}
                      size="sm"
                    />
                    <ChevronDown className={cn('h-4 w-4 text-haven-gray transition-transform', profileOpen && 'rotate-180')} />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-haven-sand/30 z-20 overflow-hidden animate-slide-up">
                        <div className="px-4 py-3 border-b border-haven-sand/30">
                          <p className="font-semibold text-haven-navy text-sm">{session?.user?.name}</p>
                          <p className="text-xs text-haven-gray">{session?.user?.email}</p>
                        </div>
                        <div className="py-1">
                          <DropdownLink href="/profile" icon={<User className="h-4 w-4" />}>View profile</DropdownLink>
                          <DropdownLink href="/dashboard" icon={<Home className="h-4 w-4" />}>My sits</DropdownLink>
                          <DropdownLink href="/saved" icon={<Heart className="h-4 w-4" />}>Favourites</DropdownLink>
                          <DropdownLink href="/settings" icon={<Settings className="h-4 w-4" />}>Settings</DropdownLink>
                          <div className="border-t border-haven-sand/30 mt-1 pt-1">
                            <button
                              onClick={() => signOut()}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-haven-error hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign out
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">Get started free</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-haven-gray-pale transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-haven-sand/30 bg-haven-cream animate-slide-up">
          <div className="container-haven py-4 space-y-1">
            <MobileLink href="/search"        onClick={() => setMobileOpen(false)}>Find a Sit</MobileLink>
            <MobileLink href="/how-it-works"  onClick={() => setMobileOpen(false)}>How it Works</MobileLink>
            <MobileLink href="/pricing"       onClick={() => setMobileOpen(false)}>Pricing</MobileLink>
            <MobileLink href="/paid-sits"     onClick={() => setMobileOpen(false)}>Paid Sits</MobileLink>
            {isLoggedIn ? (
              <>
                <MobileLink href="/dashboard" onClick={() => setMobileOpen(false)}>My Sits</MobileLink>
                <MobileLink href="/inbox"     onClick={() => setMobileOpen(false)}>Inbox</MobileLink>
                <MobileLink href="/profile"   onClick={() => setMobileOpen(false)}>Profile</MobileLink>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-haven-error rounded-xl hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="pt-3 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" className="w-full">Sign in</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full">Get started free</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function DropdownLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-haven-navy hover:bg-haven-gray-pale transition-colors"
    >
      <span className="text-haven-gray">{icon}</span>
      {children}
    </Link>
  )
}

function MobileLink({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm font-medium text-haven-navy rounded-xl hover:bg-haven-teal-pale/50 transition-colors"
    >
      {children}
    </Link>
  )
}
