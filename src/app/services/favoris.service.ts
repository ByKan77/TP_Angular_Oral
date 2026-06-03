import { Injectable, computed, inject, signal } from '@angular/core';
import { Character } from '../models/character.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'rick-morty-favoris';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private readonly storage = inject(StorageService);

  readonly favoris = signal<Character[]>(
    this.storage.get<Character[]>(STORAGE_KEY) ?? []
  );

  readonly nombre = computed(() => this.favoris().length);

  readonly repartitionParStatut = computed(() => {
    const list = this.favoris();
    return {
      alive: list.filter((c) => c.status === 'Alive').length,
      dead: list.filter((c) => c.status === 'Dead').length,
      unknown: list.filter((c) => c.status === 'unknown').length,
    };
  });

  toggle(character: Character): void {
    const current = this.favoris();
    const exists = current.some((c) => c.id === character.id);
    const next = exists
      ? current.filter((c) => c.id !== character.id)
      : [...current, character];
    this.favoris.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  isFavori(id: number): boolean {
    return this.favoris().some((c) => c.id === id);
  }
}
