'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDateRange } from '@/lib/utils'

interface DateRange {
  id: string
  start: string
  end: string
}

export default function EditAvailabilityPage() {
  const router = useRouter()
  const [ranges, setRanges] = useState<DateRange[]>([
    { id: 'r1', start: '2026-03-15', end: '2026-04-10' },
    { id: 'r2', start: '2026-06-01', end: '2026-06-28' },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd]   = useState('')
  const [saving, setSaving]   = useState(false)

  function addRange() {
    if (!newStart || !newEnd || newStart >= newEnd) return
    setRanges((prev) => [...prev, { id: `r${Date.now()}`, start: newStart, end: newEnd }])
    setNewStart('')
    setNewEnd('')
    setShowAdd(false)
  }

  function removeRange(id: string) {
    setRanges((prev) => prev.filter((r) => r.id !== id))
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    setSaving(false)
    router.push('/profile/edit')
  }

  return (
    <div className="bg-haven-cream min-h-screen">
      <div className="container-haven max-w-xl py-8">

        <Link href="/profile/edit" className="inline-flex items-center gap-1.5 text-sm text-haven-gray hover:text-haven-navy transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-haven-navy">Availability</h1>
        </div>

        <p className="text-haven-gray text-sm mb-5">
          Add the date ranges when you're available to sit. Home owners can filter by availability to find you faster.
        </p>

        {/* Existing ranges */}
        <div className="space-y-3 mb-4">
          {ranges.map((range) => (
            <div key={range.id} className="card p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-haven-teal-pale flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-haven-teal" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-haven-navy text-sm">
                  {formatDateRange(range.start, range.end)}
                </p>
              </div>
              <button
                onClick={() => removeRange(range.id)}
                className="p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new range */}
        {showAdd ? (
          <div className="card p-5 mb-5">
            <h3 className="font-semibold text-haven-navy mb-4">Add available dates</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="label">From</label>
                <input type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">To</label>
                <input type="date" value={newEnd} min={newStart} onChange={(e) => setNewEnd(e.target.value)} className="input" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button className="flex-1" disabled={!newStart || !newEnd || newStart >= newEnd} onClick={addRange}>
                Add dates
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-haven-sand hover:border-haven-teal text-haven-gray hover:text-haven-teal transition-all mb-5 font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            Add available dates
          </button>
        )}

        <Button className="w-full" leftIcon={<Save className="h-4 w-4" />} loading={saving} onClick={handleSave}>
          Save availability
        </Button>
      </div>
    </div>
  )
}
