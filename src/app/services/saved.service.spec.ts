import { beforeEach, describe, expect, it } from 'vitest';
import { SavedService } from './saved.service';

describe('SavedService (plain class and signals)', () => {
  let service: SavedService;

  beforeEach(() => {
    service = new SavedService();
  });

  it('starts with nobody saved and a count of zero', () => {
    expect(service.ids()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('saves a student on first toggle and removes on second', () => {
    service.toggle(3);
    expect(service.isSaved(3)).toBe(true);
    expect(service.count()).toBe(1);
    service.toggle(3);
    expect(service.isSaved(3)).toBe(false);
    expect(service.count()).toBe(0);
  });

  it('tracks different students independently', () => {
    service.toggle(1);
    service.toggle(2);
    service.toggle(1);
    expect(service.ids()).toEqual([2]);
    expect(service.isSaved(1)).toBe(false);
    expect(service.isSaved(2)).toBe(true);
  });

  it('returns a new snapshot rather than mutating an old array', () => {
    const before = service.ids();
    service.toggle(1);
    expect(service.ids()).not.toBe(before);
    expect(before).toEqual([]);
  });
});
