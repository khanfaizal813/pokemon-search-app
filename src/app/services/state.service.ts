import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SearchState, EncounterLocation, PaginationConfig } from '../models/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly STORAGE_KEY = 'pokemon-search-state';

  private readonly initialState: SearchState = {
    query: '',
    selectedPokemon: null,
    encounters: [],
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0
    }
  };

  private readonly stateSubject = new BehaviorSubject<SearchState>(this.loadStateFromStorage());

  constructor() {
    // Subscribe to state changes and persist to localStorage
    this.stateSubject.subscribe(state => {
      this.saveStateToStorage(state);
    });
  }

  /**
   * Get current state as observable
   */
  getState(): Observable<SearchState> {
    return this.stateSubject.asObservable();
  }

  /**
   * Get current state value
   */
  getCurrentState(): SearchState {
    return this.stateSubject.value;
  }

  /**
   * Update search query
   */
  setSearchQuery(query: string): void {
    const currentState = this.getCurrentState();
    this.updateState({
      ...currentState,
      query,
      error: null
    });
  }

  /**
   * Set selected Pokemon and clear previous results
   */
  setSelectedPokemon(pokemon: string): void {
    const currentState = this.getCurrentState();
    this.updateState({
      ...currentState,
      selectedPokemon: pokemon,
      encounters: [],
      error: null,
      pagination: {
        ...currentState.pagination,
        currentPage: 1,
        totalItems: 0
      }
    });
  }

  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    const currentState = this.getCurrentState();
    this.updateState({
      ...currentState,
      isLoading,
      error: isLoading ? null : currentState.error
    });
  }

  /**
   * Set encounters data
   */
  setEncounters(encounters: EncounterLocation[]): void {
    const currentState = this.getCurrentState();
    this.updateState({
      ...currentState,
      encounters,
      isLoading: false,
      error: null,
      pagination: {
        ...currentState.pagination,
        currentPage: 1,
        totalItems: encounters.length
      }
    });
  }

  /**
   * Set error state
   */
  setError(error: string): void {
    const currentState = this.getCurrentState();
    this.updateState({
      ...currentState,
      error,
      isLoading: false
    });
  }

  /**
   * Update pagination
   */
  setPagination(pagination: Partial<PaginationConfig>): void {
    const currentState = this.getCurrentState();
    this.updateState({
      ...currentState,
      pagination: {
        ...currentState.pagination,
        ...pagination
      }
    });
  }

  /**
   * Clear all state (reset to initial)
   */
  clearState(): void {
    this.updateState(this.initialState);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Clear only search results but keep query
   */
  clearResults(): void {
    const currentState = this.getCurrentState();
    this.updateState({
      ...currentState,
      selectedPokemon: null,
      encounters: [],
      error: null,
      isLoading: false,
      pagination: {
        ...currentState.pagination,
        currentPage: 1,
        totalItems: 0
      }
    });
  }

  /**
   * Get paginated encounters for current page
   */
  getPaginatedEncounters(): EncounterLocation[] {
    const state = this.getCurrentState();
    const { encounters, pagination } = state;
    const { currentPage, itemsPerPage } = pagination;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return encounters.slice(startIndex, endIndex);
  }

  /**
   * Check if there are any search results
   */
  hasResults(): boolean {
    const state = this.getCurrentState();
    return state.encounters.length > 0;
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this.getCurrentState().isLoading;
  }

  /**
   * Check if there's an error
   */
  hasError(): boolean {
    return !!this.getCurrentState().error;
  }

  /**
   * Private method to update state
   */
  private updateState(newState: SearchState): void {
    this.stateSubject.next(newState);
  }

  /**
   * Load state from localStorage
   */
  private loadStateFromStorage(): SearchState {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Reset loading state on page load
        return {
          ...this.initialState,
          ...parsedState,
          isLoading: false,
          error: null
        };
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }

    return this.initialState;
  }

  /**
   * Save state to localStorage
   */
  private saveStateToStorage(state: SearchState): void {
    try {
      // Don't save loading or error states
      const stateToSave = {
        ...state,
        isLoading: false,
        error: null
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }
}
