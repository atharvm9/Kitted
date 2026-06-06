function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillRatePerMs: number;
  private queue: Array<{ count: number; resolve: () => void }> = [];
  private draining = false;

  /** @param capacity Max burst tokens. @param refillPerSecond Steady-state rate. */
  constructor(capacity: number, refillPerSecond: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRatePerMs = refillPerSecond / 1000;
    this.lastRefill = Date.now();
  }

  async acquire(count = 1): Promise<void> {
    return new Promise((resolve) => {
      this.queue.push({ count, resolve });
      if (!this.draining) this.drain();
    });
  }

  private async drain(): Promise<void> {
    this.draining = true;
    while (this.queue.length > 0) {
      this.refill();
      const head = this.queue[0]!;
      if (this.tokens >= head.count) {
        this.tokens -= head.count;
        this.queue.shift();
        head.resolve();
      } else {
        const deficit = head.count - this.tokens;
        const waitMs = deficit / this.refillRatePerMs;
        await sleep(waitMs);
      }
    }
    this.draining = false;
  }

  private refill(): void {
    const now = Date.now();
    const gained = (now - this.lastRefill) * this.refillRatePerMs;
    this.tokens = Math.min(this.capacity, this.tokens + gained);
    this.lastRefill = now;
  }
}
