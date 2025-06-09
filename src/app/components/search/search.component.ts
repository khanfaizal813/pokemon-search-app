import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { StateService } from '../../services/state.service';
import { EncounterLocation, Pokemon } from '../../models/pokemon.interface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8 animate-fade-in">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Discover Pokemon
          <span class="text-pokemon-red">Encounters</span>
        </h1>
        <p class="text-lg text-gray-600 max-w-xl mx-auto">
          Search for any Pokemon and explore where they can be found in the wild.
          Get detailed encounter information and location data.
        </p>
      </div>

      <div class="card p-6 md:p-8 animate-fade-in">
        <div class="relative">
          <!-- Search Input -->
          <div class="relative">
            <input
              #searchInput
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchInput()"
              (focus)="onInputFocus()"
              (blur)="onInputBlur()"
              (keydown)="onKeyDown($event)"
              placeholder="Enter Pokemon name (e.g., pikachu, charizard, bulbasaur)"
              class="input-field pr-12 text-lg"
              [class.border-pokemon-red]="hasError"
              autocomplete="off"
              spellcheck="false"
            />

            <!-- Search Icon -->
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                *ngIf="!isSearching"
                class="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>

              <div *ngIf="isSearching" class="loading-spinner text-pokemon-red"></div>
            </div>
          </div>

          <!-- Error Message -->
          <div
            *ngIf="errorMessage"
            class="mt-2 text-sm text-red-600 animate-fade-in"
          >
            {{ errorMessage }}
          </div>

          <!-- Autosuggest Dropdown -->
          <div
            *ngIf="showSuggestions && suggestions.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto animate-slide-down"
          >
            <div
              *ngFor="let pokemon of suggestions; let i = index; trackBy: trackByName"
              (click)="selectPokemon(pokemon)"
              (mouseenter)="selectedIndex = i"
              [class]="getSuggestionClasses(i)"
              class="px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div class="flex items-center justify-between">
                <span class="text-gray-900 font-medium capitalize">{{ pokemon.name }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- No Results Message -->
          <div
            *ngIf="showSuggestions && suggestions.length === 0 && searchQuery.length > 0 && !isSearching"
            class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 animate-slide-down"
          >
            <div class="text-center text-gray-500">
              <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p>No Pokemon found matching "{{ searchQuery }}"</p>
              <p class="text-sm mt-1">Try checking the spelling or search for a different Pokemon</p>
            </div>
          </div>
        </div>

        <!-- Search Button -->
        <button
          (click)="performSearch()"
          [disabled]="!searchQuery.trim() || isSearching"
          class="btn-primary w-full mt-6 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span *ngIf="!isSearching" class="flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span>Search Pokemon Encounters</span>
          </span>

          <span *ngIf="isSearching" class="flex items-center justify-center space-x-2">
            <div class="loading-spinner"></div>
            <span>Searching...</span>
          </span>
        </button>

        <!-- Quick Search Examples -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500 mb-3">Popular searches:</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              *ngFor="let example of popularPokemon"
              (click)="selectExample(example)"
              class="px-3 py-1 bg-gray-100 hover:bg-pokemon-red hover:text-white rounded-full text-sm transition-all duration-200 transform hover:scale-105"
            >
              {{ example }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  searchQuery = '';
  suggestions: Pokemon[] = [];
  selectedIndex = -1;
  showSuggestions = false;
  isSearching = false;
  errorMessage = '';
  hasError = false;

  popularPokemon = ['pikachu', 'charizard', 'bulbasaur', 'squirtle', 'mewtwo', 'mew'];

  constructor(
    private pokemonService: PokemonService,
    private stateService: StateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load previous search query from state
    this.stateService.getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state.query && state.query !== this.searchQuery) {
          this.searchQuery = state.query;
        }
      });

    // Set up search debouncing
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query.trim()) {
            return of([]);
          }
          this.isSearching = true;
          return this.pokemonService.searchPokemon(query, 8);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (suggestions) => {
          this.suggestions = suggestions;
          this.isSearching = false;
          this.selectedIndex = -1;
          this.clearError();
        },
        error: (error) => {
          this.isSearching = false;
          this.setError('Failed to search Pokemon. Please try again.');
          console.error('Search error:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(): void {
    this.stateService.setSearchQuery(this.searchQuery);
    this.searchSubject.next(this.searchQuery);
    this.showSuggestions = true;
    this.clearError();
  }

  onInputFocus(): void {
    if (this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onInputBlur(): void {
    // Delay hiding suggestions to allow click events on suggestions
    setTimeout(() => {
      this.showSuggestions = false;
      this.selectedIndex = -1;
    }, 200);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions || this.suggestions.length === 0) {
      if (event.key === 'Enter') {
        this.performSearch();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;

      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectPokemon(this.suggestions[this.selectedIndex]);
        } else {
          this.performSearch();
        }
        break;

      case 'Escape':
        this.showSuggestions = false;
        this.selectedIndex = -1;
        this.searchInput.nativeElement.blur();
        break;
    }
  }

  selectPokemon(pokemon: Pokemon): void {
    this.searchQuery = pokemon.name;
    this.stateService.setSearchQuery(this.searchQuery);
    this.showSuggestions = false;
    this.selectedIndex = -1;
    this.performSearch();
  }

  selectExample(pokemonName: string): void {
    this.searchQuery = pokemonName;
    this.stateService.setSearchQuery(this.searchQuery);
    this.performSearch();
  }

  performSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.setError('Please enter a Pokemon name to search.');
      return;
    }

    this.clearError();
    this.stateService.setSelectedPokemon(query);
    this.stateService.setLoading(true);

    this.pokemonService.getPokemonEncounters(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: { encounters: EncounterLocation[]; }) => {
          this.stateService.setEncounters(result.encounters);
          this.router.navigate(['/results']);
        },
        error: (error) => {
          this.stateService.setError(error.message);
          this.setError(error.message);
        }
      });
  }

  getSuggestionClasses(index: number): string {
    return index === this.selectedIndex
      ? 'bg-pokemon-red bg-opacity-10 text-pokemon-red'
      : 'hover:bg-gray-50';
  }

  trackByName(index: number, pokemon: Pokemon): string {
    return pokemon.name;
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.hasError = true;
  }

  private clearError(): void {
    this.errorMessage = '';
    this.hasError = false;
  }
}
