import type { Metadata } from 'next'
import { SearchClient } from '@/components/search/search-client'

export const metadata: Metadata = {
  title: 'Find a Sit — Haven Housesits',
  description: 'Browse thousands of free & paid house sits worldwide. Filter by pet type, location, dates, dog walk requirements and more.',
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  return <SearchClient initialParams={searchParams} />
}
