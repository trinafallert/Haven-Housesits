/**
 * In-memory sliding window rate limiter.
 * Replace with Redis (Upstash) in production for multi-instance support.
 */

const store = new Map<string, { count: number; resetAt: number }>()

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}
