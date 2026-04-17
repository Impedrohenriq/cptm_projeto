import { describe, it, expect, vi, afterEach } from 'vitest'
import { BACKOFF, getBackoffDelay } from '@/services/syncEngine.js'

describe('getBackoffDelay', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns base delay on first retry when jitter is zero', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const delay = getBackoffDelay(1, 2000, 60000)
    expect(delay).toBe(2000)
  })

  it('grows exponentially across retries', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const d1 = getBackoffDelay(1, 1000, 60000)
    const d2 = getBackoffDelay(2, 1000, 60000)
    const d3 = getBackoffDelay(3, 1000, 60000)

    expect(d2).toBeGreaterThan(d1)
    expect(d3).toBeGreaterThan(d2)
    expect(d1).toBe(1000)
    expect(d2).toBe(2000)
    expect(d3).toBe(4000)
  })

  it('caps delay at maxDelayMs', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const delay = getBackoffDelay(20, 1000, 5000)
    expect(delay).toBe(5000)
  })

  it('uses default config when arguments are omitted', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const delay = getBackoffDelay(1)
    expect(delay).toBe(BACKOFF.baseDelayMs)
  })
})
