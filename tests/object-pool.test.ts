import { describe, expect, it } from 'vitest';
import { ObjectPool } from '../src/core/object-pool';

describe('ObjectPool', () => {
  it('prewarms and reuses released objects', () => {
    let nextId = 0;
    const pool = new ObjectPool({
      create: () => ({ id: ++nextId, active: true }),
      reset: item => {
        item.active = false;
      },
      initialSize: 2,
      maxSize: 3,
    });

    const first = pool.acquire();
    const second = pool.acquire();

    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(pool.totalCount).toBe(2);
    expect(pool.inUseCount).toBe(2);

    expect(pool.release(first!)).toBe(true);
    expect(first!.active).toBe(false);

    const reused = pool.acquire();
    expect(reused).toBe(first);
    expect(pool.totalCount).toBe(2);
  });

  it('enforces the configured maximum', () => {
    const pool = new ObjectPool({
      create: () => ({}),
      maxSize: 1,
    });

    expect(pool.acquire()).toBeDefined();
    expect(pool.acquire()).toBeUndefined();
  });

  it('rejects releasing an object that is not checked out', () => {
    const pool = new ObjectPool({ create: () => ({}) });
    expect(pool.release({})).toBe(false);
  });
});
