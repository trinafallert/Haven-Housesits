'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn, initials } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  firstName?: string
  lastName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  ring?: boolean
}

const sizeMap = {
  xs:  'h-6  w-6  text-xs',
  sm:  'h-8  w-8  text-sm',
  md:  'h-10 w-10 text-sm',
  lg:  'h-12 w-12 text-base',
  xl:  'h-16 w-16 text-lg',
  '2xl': 'h-24 w-24 text-2xl',
}

const pxMap = {
  xs: 24, sm: 32, md: 40, lg: 48, xl: 64, '2xl': 96,
}

export function Avatar({ src, firstName = '?', lastName, size = 'md', className, ring }: AvatarProps) {
  const sizeClass = sizeMap[size]
  const px = pxMap[size]
  const text = initials(firstName, lastName)

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex-shrink-0 bg-haven-teal-pale',
        sizeClass,
        ring && 'ring-2 ring-white ring-offset-1',
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={`${firstName} ${lastName ?? ''}`}
          fill
          sizes={`${px}px`}
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center font-semibold text-haven-teal-dark">
          {text}
        </div>
      )}
    </div>
  )
}
