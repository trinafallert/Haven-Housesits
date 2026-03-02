'use client'

import { useState } from 'react'
import { X, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SaveSearchModalProps {
  searchName: string
  onClose: () => void
  onSave: (name: string) => void
}

export function SaveSearchModal({ searchName, onClose, onSave }: SaveSearchModalProps) {
  const [name, setName] = useState(searchName)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-card-hover p-8 w-full max-w-sm animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-haven-gray-pale transition-colors">
          <X className="h-4 w-4 text-haven-gray" />
        </button>

        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-haven-teal-pale flex items-center justify-center mx-auto mb-3">
            <Bell className="h-6 w-6 text-haven-teal" />
          </div>
          <h2 className="font-display text-xl font-bold text-haven-navy mb-1">Name your saved search</h2>
          <p className="text-sm text-haven-gray">
            We'll notify you whenever a new matching sit is posted.
          </p>
        </div>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Los Angeles, CA"
          className="mb-6"
        />

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(name)} disabled={!name.trim()}>Save</Button>
        </div>
      </div>
    </div>
  )
}
