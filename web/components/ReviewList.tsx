'use client'

import { useState } from 'react'
import { Star, Flag } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import ReviewDisputeModal from '@/components/ReviewDisputeModal'

interface Review {
  id: string
  rating: number
  comment?: string | null
  createdAt: string | Date
  reviewer: {
    firstName: string
    lastName: string
    avatar?: string | null
  }
  listing?: {
    city: string
    state?: string | null
  } | null
}

export default function ReviewList({
  reviews,
  averageRating,
  totalReviews,
}: {
  reviews: Review[]
  averageRating?: number | null
  totalReviews?: number | null
}) {
  const [disputeReview, setDisputeReview] = useState<Review | null>(null)

  if (!reviews || reviews.length === 0) return null

  return (
    <>
      <div className="card p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-haven-navy">Reviews</h2>
          {averageRating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-haven-navy">{averageRating.toFixed(2)}</span>
              <span className="text-xs text-haven-gray">({totalReviews})</span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-haven-sand/30 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center gap-3 mb-2">
                <Avatar
                  src={review.reviewer.avatar ?? undefined}
                  firstName={review.reviewer.firstName}
                  lastName={review.reviewer.lastName}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-semibold text-haven-navy">
                    {review.reviewer.firstName} {review.reviewer.lastName}
                  </p>
                  {review.listing && (
                    <p className="text-xs text-haven-gray">
                      {review.listing.city}{review.listing.state ? `, ${review.listing.state}` : ''}
                    </p>
                  )}
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-haven-sand'}`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-haven-gray leading-relaxed">{review.comment}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-haven-gray-light">
                  {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
                <button
                  onClick={() => setDisputeReview(review)}
                  className="flex items-center gap-1 text-xs text-haven-gray hover:text-haven-warning transition-colors group"
                >
                  <Flag className="h-3 w-3 group-hover:text-haven-warning" />
                  Request support
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {disputeReview && (
        <ReviewDisputeModal
          reviewId={disputeReview.id}
          reviewerName={`${disputeReview.reviewer.firstName} ${disputeReview.reviewer.lastName}`}
          reviewComment={disputeReview.comment ?? undefined}
          onClose={() => setDisputeReview(null)}
        />
      )}
    </>
  )
}
