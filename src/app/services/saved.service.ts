import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SavedService {
  private readonly _savedIds = signal<number[]>([]);
  readonly savedIds = this._savedIds.asReadonly();
  readonly count = computed(() => this._savedIds().length);

  ids(): number[] { return [...this._savedIds()]; }

  isSaved(id: number): boolean { return this._savedIds().includes(id); }

  toggle(id: number): void {
    this._savedIds.update((ids) => ids.includes(id)
      ? ids.filter((entry) => entry !== id) : [...ids, id]);
  }
}
