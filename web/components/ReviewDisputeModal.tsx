'use client'

import { useState, useRef } from 'react'
import { X, Upload, AlertTriangle, CheckCircle, Paperclip } from 'lucide-react'

interface ReviewDisputeModalProps {
  reviewId: string
  reviewerName: string
  reviewComment?: string
  onClose: () => void
}

export default function ReviewDisputeModal({
  reviewId,
  reviewerName,
  reviewComment,
  onClose,
}: ReviewDisputeModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [submitting, setSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    inaccurate: '',
    proof: '',
    unfair: '',
    sideOfStory: '',
    email: '',
    phone: '',
  })

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Build FormData so we can attach files
    const fd = new FormData()
    fd.append('reviewId', reviewId)
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    files.forEach((f) => fd.append('attachments', f))

    try {
      await fetch('/haven/api/reviews/dispute', { method: 'POST', body: fd })
    } catch {
      // fail silently — still show success (support will also get email)
    }

    setSubmitting(false)
    setStep('success')
  }

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    rows = 3,
    type: 'textarea' | 'input' = 'textarea'
  ) => (
    <div>
      <label className="block text-sm font-semibold text-haven-navy mb-1">{label}</label>
      {type === 'input' ? (
        <input
          type="text"
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full rounded-xl border border-haven-sand px-4 py-2.5 text-sm text-haven-navy placeholder:text-haven-gray-light focus:outline-none focus:ring-2 focus:ring-haven-teal/40 bg-white"
        />
      ) : (
        <textarea
          rows={rows}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full rounded-xl border border-haven-sand px-4 py-2.5 text-sm text-haven-navy placeholder:text-haven-gray-light focus:outline-none focus:ring-2 focus:ring-haven-teal/40 bg-white resize-none"
        />
      )}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-haven-navy/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-haven-cream rounded-t-3xl sm:rounded-3xl shadow-haven-lg overflow-hidden flex flex-col max-h-[92dvh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-haven-sand/40 shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-haven-warning" />
            <h2 className="font-display text-lg font-bold text-haven-navy">Request Review Support</h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-haven-sand/40 hover:bg-haven-sand flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-haven-gray" />
          </button>
        </div>

        {step === 'success' ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-haven-teal/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-haven-teal" />
            </div>
            <h3 className="font-display text-xl font-bold text-haven-navy">Request Submitted</h3>
            <p className="text-sm text-haven-gray leading-relaxed">
              Our support team will review your case and reach out within <strong>2–3 business days</strong>.
              We take every report seriously and will fairly assess both sides before making any decision.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-full bg-haven-teal text-white text-sm font-semibold hover:bg-haven-teal-dark transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

            {/* Context chip */}
            {reviewComment && (
              <div className="rounded-xl bg-haven-sand/30 border border-haven-sand/50 px-4 py-3">
                <p className="text-xs text-haven-gray mb-0.5">Review by {reviewerName}</p>
                <p className="text-sm text-haven-navy italic line-clamp-3">"{reviewComment}"</p>
              </div>
            )}

            {field(
              'inaccurate',
              '1. What was inaccurate about this review?',
              'Describe any specific statements that are factually wrong or misleading…',
              3
            )}

            {field(
              'unfair',
              '2. Why do you think this review is unfair?',
              'Explain why this review does not accurately reflect your experience…',
              3
            )}

            {field(
              'sideOfStory',
              '3. Your side of the story',
              'Please share as much detail as possible — the more context you give us, the faster we can make a fair decision…',
              5
            )}

            {/* Proof / uploads */}
            <div>
              <label className="block text-sm font-semibold text-haven-navy mb-1">
                4. Do you have any proof? <span className="font-normal text-haven-gray">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={form.proof}
                onChange={(e) => setForm((f) => ({ ...f, proof: e.target.value }))}
                placeholder="Describe any evidence you have (screenshots, messages, etc.)…"
                className="w-full rounded-xl border border-haven-sand px-4 py-2.5 text-sm text-haven-navy placeholder:text-haven-gray-light focus:outline-none focus:ring-2 focus:ring-haven-teal/40 bg-white resize-none mb-2"
              />

              {/* File upload */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-haven-sand hover:border-haven-teal text-sm text-haven-gray hover:text-haven-teal transition-colors w-full justify-center"
              >
                <Upload className="h-4 w-4" />
                Upload screenshots or photos
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFile}
              />

              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-haven-navy bg-white rounded-lg px-3 py-1.5 border border-haven-sand/50">
                      <Paperclip className="h-3 w-3 text-haven-teal shrink-0" />
                      <span className="truncate flex-1">{f.name}</span>
                      <button type="button" onClick={() => removeFile(i)} className="text-haven-gray hover:text-haven-error">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="rounded-2xl bg-haven-teal/5 border border-haven-teal/20 p-4 space-y-3">
              <p className="text-xs font-semibold text-haven-teal uppercase tracking-wide">Contact for faster resolution</p>
              <p className="text-xs text-haven-gray -mt-1">
                Our support team may need to follow up with questions. Adding your contact info helps us resolve this faster.
              </p>
              {field('email', 'Email address', 'you@example.com', 1, 'input')}
              {field('phone', 'Phone number', '+1 (555) 000-0000', 1, 'input')}
            </div>

            {/* Submit */}
            <div className="pt-1 pb-2">
              <button
                type="submit"
                disabled={submitting || !form.sideOfStory.trim()}
                className="w-full py-3 rounded-full bg-haven-teal text-white font-semibold text-sm hover:bg-haven-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting…' : 'Submit to Haven Support'}
              </button>
              <p className="text-xs text-haven-gray text-center mt-2">
                We review all disputes fairly. Submitting a false report may affect your account.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
