'use client'

import { ShieldCheck, Lock, Clock, CreditCard } from 'lucide-react'

export default function PaidSitEscrowBanner({ sitRate }: { sitRate?: number | null }) {
  return (
    <div className="rounded-2xl bg-haven-teal/5 border border-haven-teal/20 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-full bg-haven-teal/10 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="h-4 w-4 text-haven-teal" />
        </div>
        <div>
          <p className="text-sm font-bold text-haven-navy">Secure Escrow Payment</p>
          <p className="text-xs text-haven-gray">Haven holds your payment until the sit is complete</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <CreditCard className="h-4 w-4 text-haven-teal mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-haven-navy">Charged at booking</p>
            <p className="text-xs text-haven-gray">Your card is charged when the sit is confirmed — funds are held securely, not released yet.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Lock className="h-4 w-4 text-haven-teal mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-haven-navy">Held safely until completion</p>
            <p className="text-xs text-haven-gray">Haven holds the funds in escrow throughout the sit. Neither party can access them until it's done.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Clock className="h-4 w-4 text-haven-teal mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-haven-navy">Released to sitter after</p>
            <p className="text-xs text-haven-gray">Once the sit ends, the sitter is paid within 2 business days. If anything goes wrong, our support team steps in.</p>
          </div>
        </div>
      </div>

      {sitRate && (
        <div className="mt-3 pt-3 border-t border-haven-teal/10 flex items-center justify-between">
          <span className="text-xs text-haven-gray">Total held at booking</span>
          <span className="text-sm font-bold text-haven-navy">${sitRate.toFixed(2)}</span>
        </div>
      )}

      <div className="mt-3 rounded-xl bg-haven-warning/10 border border-haven-warning/20 px-3 py-2">
        <p className="text-xs text-haven-navy font-medium text-center">
          🔒 Always book through Haven — off-app payments are not protected
        </p>
      </div>
    </div>
  )
}
