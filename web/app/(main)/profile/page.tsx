import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function ProfileIndexPage() {
  // If user is not logged in, show a helpful page
  // In a real app we'd check session server-side and redirect to /profile/[userId]
  return (
    <div className="bg-haven-cream min-h-screen flex items-center justify-center">
      <div className="card p-8 max-w-sm w-full mx-4 text-center">
        <div className="text-4xl mb-4">🏡</div>
        <h1 className="font-display text-2xl font-bold text-haven-navy mb-2">
          View Your Profile
        </h1>
        <p className="text-haven-gray text-sm mb-6">
          Sign in to view and manage your Haven Housesits profile.
        </p>
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full py-3 px-6 bg-haven-teal text-white rounded-xl font-semibold text-sm hover:bg-haven-teal-dark transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/search"
            className="block w-full py-3 px-6 border border-haven-sand text-haven-gray rounded-xl font-medium text-sm hover:bg-haven-sand/20 transition-colors"
          >
            Browse listings
          </Link>
        </div>
      </div>
    </div>
  )
}
