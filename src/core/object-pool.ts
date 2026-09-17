export interface ObjectPoolOptions<T> {
  readonly create: () => T;
  readonly reset?: (item: T) => void;
  readonly initialSize?: number;
  readonly maxSize?: number;
}

/**
 * Small portable pool for reusable world objects.
 *
 * Horizon-facing code can wrap pooled entities, effects, UI handles, or other
 * reusable resources without coupling this core primitive to a platform API.
 */
export class ObjectPool<T> {
  private readonly available: T[] = [];
  private readonly inUse = new Set<T>();
  private readonly createItem: () => T;
  private readonly resetItem?: (item: T) => void;
  private readonly maxSize: number;
  private created = 0;

  public constructor(options: ObjectPoolOptions<T>) {
    this.createItem = options.create;
    this.resetItem = options.reset;
    this.maxSize = options.maxSize ?? Number.POSITIVE_INFINITY;

    const initialSize = options.initialSize ?? 0;
    if (!Number.isInteger(initialSize) || initialSize < 0) {
      throw new Error('initialSize must be a non-negative integer.');
    }

    if (this.maxSize <= 0 || initialSize > this.maxSize) {
      throw new Error('maxSize must be positive and at least initialSize.');
    }

    for (let index = 0; index < initialSize; index += 1) {
      this.available.push(this.create());
    }
  }

  public acquire(): T | undefined {
    const item = this.available.pop() ?? this.tryCreate();
    if (item === undefined) {
      return undefined;
    }

    this.inUse.add(item);
    return item;
  }

  public release(item: T): boolean {
    if (!this.inUse.delete(item)) {
      return false;
    }

    this.resetItem?.(item);
    this.available.push(item);
    return true;
  }

  public releaseAll(): void {
    for (const item of [...this.inUse]) {
      this.release(item);
    }
  }

  public get availableCount(): number {
    return this.available.length;
  }

  public get inUseCount(): number {
    return this.inUse.size;
  }

  public get totalCount(): number {
    return this.created;
  }

  private tryCreate(): T | undefined {
    return this.created < this.maxSize ? this.create() : undefined;
  }

  private create(): T {
    const item = this.createItem();
    this.created += 1;
    return item;
  }
}
