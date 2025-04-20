interface RateLimitOptions {
  interval: number;
  maxRequests: number;
  uniqueTokenPerInterval: number;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenBuckets = new Map<string, TokenBucket>();

  return {
    async check(limit: number, identifier: string): Promise<void> {
      const now = Date.now();
      let bucket = tokenBuckets.get(identifier);

      if (!bucket) {
        bucket = {
          tokens: options.maxRequests,
          lastRefill: now,
        };
        tokenBuckets.set(identifier, bucket);
      }

      // Calculate tokens to add based on time passed
      const timePassed = now - bucket.lastRefill;
      const tokensToAdd = Math.floor(timePassed / options.interval) * options.maxRequests;
      
      bucket.tokens = Math.min(options.maxRequests, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;

      if (bucket.tokens < limit) {
        throw new Error('Rate limit exceeded');
      }

      bucket.tokens -= limit;

      // Clean up old entries
      if (tokenBuckets.size > options.uniqueTokenPerInterval) {
        const iterator = tokenBuckets.keys();
        const firstKey = iterator.next().value;
        if (firstKey) {
          tokenBuckets.delete(firstKey);
        }
      }
    },
  };
} 