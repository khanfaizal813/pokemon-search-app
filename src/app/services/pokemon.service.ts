import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Pokemon,
  PokemonListResponse,
  EncounterLocation,
  PokemonEncounters
} from '../models/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly BASE_URL = environment.pokeApiUrl;
  private pokemonCache: Pokemon[] = [];
  private readonly encounterCache = new Map<string, EncounterLocation[]>();

  constructor(private readonly http: HttpClient) { }

  /**
   * Get list of Pokemon for autosuggest
   */
  getPokemonList(limit: number = 1000): Observable<Pokemon[]> {
    if (this.pokemonCache.length > 0) {
      return of(this.pokemonCache);
    }

    return this.http.get<PokemonListResponse>(`${this.BASE_URL}/pokemon?limit=${limit}`)
      .pipe(
        retry(3),
        map(response => {
          this.pokemonCache = response.results.sort((a, b) => a.name.localeCompare(b.name));
          return this.pokemonCache;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Search Pokemon by name with fuzzy matching
   */
  searchPokemon(query: string, limit: number = 10): Observable<Pokemon[]> {
    return this.getPokemonList().pipe(
      map(pokemon => {
        const lowercaseQuery = query.toLowerCase().trim();
        if (!lowercaseQuery) return [];

        return pokemon
          .filter(p => p.name.toLowerCase().includes(lowercaseQuery))
          .slice(0, limit);
      })
    );
  }

  /**
   * Get encounter locations for a specific Pokemon
   */
  getPokemonEncounters(pokemonName: string): Observable<PokemonEncounters> {
    const normalizedName = pokemonName.toLowerCase().trim();

    // Check cache first
    if (this.encounterCache.has(normalizedName)) {
      return of({
        pokemon: normalizedName,
        encounters: this.encounterCache.get(normalizedName)!
      }).pipe(delay(100)); // Simulate network delay for consistent UX
    }

    return this.http.get<EncounterLocation[]>(`${this.BASE_URL}/pokemon/${normalizedName}/encounters`)
      .pipe(
        retry(2),
        map(encounters => {
          // Cache the result
          this.encounterCache.set(normalizedName, encounters);

          return {
            pokemon: normalizedName,
            encounters: encounters
          };
        }),
        catchError(error => {
          // If Pokemon not found, return empty encounters
          if (error.status === 404) {
            const emptyResult = { pokemon: normalizedName, encounters: [] };
            this.encounterCache.set(normalizedName, []);
            return of(emptyResult);
          }
          return this.handleError(error);
        })
      );
  }

  /**
   * Validate if a Pokemon name exists
   */
  validatePokemonName(name: string): Observable<boolean> {
    return this.getPokemonList().pipe(
      map(pokemon => pokemon.some(p => p.name.toLowerCase() === name.toLowerCase()))
    );
  }

  /**
   * Clear all caches (useful for testing or memory management)
   */
  clearCache(): void {
    this.pokemonCache = [];
    this.encounterCache.clear();
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching data.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the Pokemon API. Please check your internet connection.';
          break;
        case 404:
          errorMessage = 'Pokemon not found. Please check the spelling and try again.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          errorMessage = 'Pokemon API is currently unavailable. Please try again later.';
          break;
        default:
          errorMessage = `Server error: ${error.status} - ${error.message}`;
      }
    }

    console.error('Pokemon Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
