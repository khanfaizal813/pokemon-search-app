export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface EncounterLocation {
  location_area: {
    name: string;
    url: string;
  };
  version_details: Array<{
    encounter_details: Array<{
      chance: number;
      condition_values: any[];
      max_level: number;
      method: {
        name: string;
        url: string;
      };
      min_level: number;
    }>;
    max_chance: number;
    version: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonEncounters {
  pokemon: string;
  encounters: EncounterLocation[];
}

export interface NavigationItem {
  label: string;
  route: string;
  icon?: string;
}

export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface SearchState {
  query: string;
  selectedPokemon: string | null;
  encounters: EncounterLocation[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationConfig;
}
