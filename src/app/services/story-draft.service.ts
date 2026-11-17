import { Injectable } from '@angular/core';
import { StoredStoryDraft, StoryDraft } from '../models/story-draft.model';

@Injectable({ providedIn: 'root' })
export class StoryDraftService {
  // Every student uses their own key on a shared computer.
  private key(studentId: number): string {
    return `giu:story-draft:${studentId}`;
  }

  load(studentId: number): StoredStoryDraft | null {
    try {
      const text = localStorage.getItem(this.key(studentId));
      if (!text) return null;
      const parsed: unknown = JSON.parse(text);
      if (!this.isStoredStoryDraft(parsed)) return null;
      return parsed;
    } catch {
      // Corrupt data / disabled storage should never crash the profile page.
      return null;
    }
  }

  save(studentId: number, values: StoryDraft): string | null {
    const stored: StoredStoryDraft = { savedAt: new Date().toISOString(), values };
    try {
      localStorage.setItem(this.key(studentId), JSON.stringify(stored));
      return stored.savedAt;
    } catch {
      return null;
    }
  }

  clear(studentId: number): void {
    try {
      localStorage.removeItem(this.key(studentId));
    } catch { /* Private mode / browser restrictions */ }
  }

  private isStoredStoryDraft(value: unknown): value is StoredStoryDraft {
    if (typeof value !== 'object' || value === null) return false;
    const item = value as Record<string, unknown>;
    if (typeof item['savedAt'] !== 'string') return false;
    const values = item['values'];
    if (typeof values !== 'object' || values === null) return false;
    const draft = values as Record<string, unknown>;
    return typeof draft['quote'] === 'string' &&
      typeof draft['story'] === 'string' &&
      typeof draft['moment'] === 'string' &&
      typeof draft['next'] === 'string' &&
      typeof draft['consent'] === 'boolean';
  }
}
