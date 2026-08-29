'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Bell, Lock, CreditCard, Globe, Trash2, ChevronRight,
  Shield, LogOut, Mail, Phone, Moon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

function Toggle({ label, desc, value, onChange }: {
  label: string; desc?: string; value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-haven-sand/30 last:border-0">
      <div>
        <p className="font-medium text-haven-navy text-sm">{label}</p>
        {desc && <p className="text-xs text-haven-gray mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 flex-shrink-0 ml-4 ${value ? 'bg-haven-teal' : 'bg-haven-sand'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

function SettingRow({ icon: Icon, label, desc, href, danger = false }: {
  icon: React.ElementType; label: string; desc?: string; href?: string; danger?: boolean
}) {
  const content = (
    <div className={`flex items-center gap-3 py-3.5 border-b border-haven-sand/30 last:border-0 hover:bg-haven-gray-pale/30 transition-colors px-0.5 ${danger ? 'text-red-500' : 'text-haven-navy'}`}>
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50' : 'bg-haven-gray-pale'}`}>
        <Icon className={`h-4 w-4 ${danger ? 'text-red-500' : 'text-haven-gray'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${danger ? 'text-red-600' : 'text-haven-navy'}`}>{label}</p>
        {desc && <p className="text-xs text-haven-gray truncate">{desc}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-haven-gray-light flex-shrink-0" />
    </div>
  )

  if (href) return <Link href={href}>{content}</Link>
  return <div className="cursor-pointer">{content}</div>
}

export default function SettingsPage() {
  const router = useRouter()

  // Notification toggles
  const [notifs, setNotifs] = useState({
    newApplication: true,
    applicationAccepted: true,
    newMessage: true,
    reviewPublished: true,
    tipReceived: true,
    listingExpiring: false,
    newsletterTips: true,
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
  })

  const [plan, setPlan] = useState('STANDARD')

  function toggleNotif(key: keyof typeof notifs) {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-haven-cream min-h-screen">
      <div className="container-haven max-w-xl py-8">

        <h1 className="font-display text-3xl font-bold text-haven-navy mb-6">Settings</h1>

        {/* Membership */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-haven-gray uppercase tracking-wider mb-2 px-1">Membership</h2>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-haven-navy">Standard Plan</p>
                <p className="text-xs text-haven-gray">$79/yr · Renews Mar 15, 2027</p>
              </div>
              <span className="badge-teal">Active</span>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="flex-1">Upgrade to Premium</Button>
              <Button variant="ghost" size="sm" className="text-haven-gray">Cancel plan</Button>
            </div>
          </div>
        </div>

        {/* Notification settings */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-haven-gray uppercase tracking-wider mb-2 px-1">Notifications</h2>
          <div className="card p-5">
            <h3 className="font-semibold text-haven-navy text-sm mb-1">Delivery channels</h3>
            <Toggle label="Push notifications" value={notifs.pushEnabled} onChange={() => toggleNotif('pushEnabled')} />
            <Toggle label="Email notifications" value={notifs.emailEnabled} onChange={() => toggleNotif('emailEnabled')} />
            <Toggle label="SMS / text alerts" desc="US only — standard rates apply" value={notifs.smsEnabled} onChange={() => toggleNotif('smsEnabled')} />
          </div>
          <div className="card p-5 mt-3">
            <h3 className="font-semibold text-haven-navy text-sm mb-1">What to notify me about</h3>
            <Toggle label="New application received"     value={notifs.newApplication}     onChange={() => toggleNotif('newApplication')} />
            <Toggle label="Application accepted / declined" value={notifs.applicationAccepted} onChange={() => toggleNotif('applicationAccepted')} />
            <Toggle label="New messages"                 value={notifs.newMessage}          onChange={() => toggleNotif('newMessage')} />
            <Toggle label="Review published"             value={notifs.reviewPublished}     onChange={() => toggleNotif('reviewPublished')} />
            <Toggle label="Tip received"                 value={notifs.tipReceived}         onChange={() => toggleNotif('tipReceived')} />
            <Toggle label="Listing expiring soon"        value={notifs.listingExpiring}     onChange={() => toggleNotif('listingExpiring')} />
            <Toggle label="Tips & newsletter from Haven" value={notifs.newsletterTips}      onChange={() => toggleNotif('newsletterTips')} />
          </div>
        </div>

        {/* Account settings */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-haven-gray uppercase tracking-wider mb-2 px-1">Account</h2>
          <div className="card divide-y divide-haven-sand/30 overflow-hidden">
            <SettingRow icon={Mail}   label="Email address"           desc="jordan@example.com" href="/settings/email" />
            <SettingRow icon={Phone}  label="Phone number"            desc="Not added" href="/settings/phone" />
            <SettingRow icon={Lock}   label="Change password"         href="/settings/password" />
            <SettingRow icon={Shield} label="Two-factor authentication" desc="Not enabled" href="/settings/2fa" />
            <SettingRow icon={Globe}  label="Language & currency"     desc="English · USD" href="/settings/locale" />
            <SettingRow icon={Moon}   label="Appearance"              desc="System default" href="/settings/appearance" />
          </div>
        </div>

        {/* Payments */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-haven-gray uppercase tracking-wider mb-2 px-1">Payments</h2>
          <div className="card divide-y divide-haven-sand/30 overflow-hidden">
            <SettingRow icon={CreditCard} label="Payment methods"       desc="Visa •••• 4242" href="/settings/payments" />
            <SettingRow icon={CreditCard} label="Payout account"        desc="Bank account ending 6789" href="/settings/payout" />
          </div>
        </div>

        {/* Danger zone */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-haven-gray uppercase tracking-wider mb-2 px-1">Account actions</h2>
          <div className="card divide-y divide-haven-sand/30 overflow-hidden">
            <SettingRow icon={LogOut}  label="Sign out"                href="/api/auth/signout" />
            <SettingRow icon={Trash2}  label="Delete account"          desc="Permanently delete your data" danger />
          </div>
        </div>

        <p className="text-center text-xs text-haven-gray">
          Haven Housesits v1.0 ·{' '}
          <Link href="/legal/privacy" className="underline hover:text-haven-navy">Privacy Policy</Link>
          {' '}·{' '}
          <Link href="/legal/terms" className="underline hover:text-haven-navy">Terms of Service</Link>
        </p>

      </div>
    </div>
  )
}
