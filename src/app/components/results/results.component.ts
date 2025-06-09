import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StateService } from '../../services/state.service';
import { EncounterLocation, SearchState } from '../../models/pokemon.interface';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              <span *ngIf="selectedPokemon" class="capitalize">{{ selectedPokemon }}</span>
              <span *ngIf="!selectedPokemon">Pokemon</span>
              Encounter Locations
            </h1>
            <p class="text-gray-600" *ngIf="!isLoading && !hasError">
              {{ getTotalResultsText() }}
            </p>
          </div>

          <button
            (click)="goBackToSearch()"
            class="btn-secondary flex items-center space-x-2 self-start sm:self-auto"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>New Search</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-12 animate-fade-in">
        <div class="loading-spinner w-12 h-12 text-pokemon-red mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Searching for encounter locations...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="hasError && !isLoading" class="card p-8 text-center animate-fade-in">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Search Error</h3>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        <button (click)="goBackToSearch()" class="btn-primary">
          Try Another Search
        </button>
      </div>

      <!-- No Results State -->
      <div *ngIf="!isLoading && !hasError && encounters.length === 0" class="card p-8 text-center animate-fade-in">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Encounters Found</h3>
        <p class="text-gray-600 mb-6">
          <span class="capitalize">{{ selectedPokemon }}</span> doesn't appear to have any recorded wild encounter locations,
          or this Pokemon might only be available through special events or breeding.
        </p>
        <button (click)="goBackToSearch()" class="btn-primary">
          Search Another Pokemon
        </button>
      </div>

      <!-- Results Table -->
      <div *ngIf="!isLoading && !hasError && encounters.length > 0" class="animate-fade-in">
        <!-- Mobile Cards View -->
        <div class="md:hidden space-y-4">
          <div
            *ngFor="let encounter of paginatedEncounters; let i = index; trackBy: trackByLocation"
            class="card p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="font-semibold text-gray-900 capitalize">
                {{ formatLocationName(encounter.location_area.name) }}
              </h3>
              <span class="text-sm text-gray-500">
                #{{ getGlobalIndex(i) }}
              </span>
            </div>

            <div class="space-y-2">
              <div *ngFor="let versionDetail of encounter.version_details.slice(0, 2)">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 capitalize">
                    {{ versionDetail.version.name }}
                  </span>
                  <span class="text-sm text-pokemon-red font-semibold">
                    {{ versionDetail.max_chance }}% chance
                  </span>
                </div>

                <div *ngIf="versionDetail.encounter_details.length > 0" class="text-xs text-gray-500">
                  <div *ngFor="let detail of versionDetail.encounter_details.slice(0, 1)">
                    Level {{ detail.min_level }}-{{ detail.max_level }} •
                    <span class="capitalize">{{ formatMethodName(detail.method.name) }}</span>
                  </div>
                </div>
              </div>

              <div *ngIf="encounter.version_details.length > 2" class="text-xs text-gray-400">
                +{{ encounter.version_details.length - 2 }} more versions
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game Version
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Chance
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level Range
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <ng-container *ngFor="let encounter of paginatedEncounters; let i = index; trackBy: trackByLocation">
                  <tr
                    *ngFor="let versionDetail of encounter.version_details; let j = index; trackBy: trackByVersion"
                    class="hover:bg-gray-50 transition-colors duration-150"
                    [class.border-t-2]="j === 0 && i > 0"
                    [class.border-gray-200]="j === 0 && i > 0"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span *ngIf="j === 0">{{ getGlobalIndex(i) }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div *ngIf="j === 0" class="text-sm font-medium text-gray-900 capitalize">
                        {{ formatLocationName(encounter.location_area.name) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {{ versionDetail.version.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-semibold text-pokemon-red">
                        {{ versionDetail.max_chance }}%
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div *ngIf="versionDetail.encounter_details.length > 0">
                        <div *ngFor="let detail of versionDetail.encounter_details.slice(0, 1)">
                          {{ detail.min_level }}-{{ detail.max_level }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div *ngIf="versionDetail.encounter_details.length > 0">
                        <div *ngFor="let detail of versionDetail.encounter_details.slice(0, 1)" class="capitalize">
                          {{ formatMethodName(detail.method.name) }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ResultsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedPokemon = '';
  encounters: EncounterLocation[] = [];
  paginatedEncounters: EncounterLocation[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private stateService: StateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.stateService.getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: SearchState) => {
        this.selectedPokemon = state.selectedPokemon || '';
        this.encounters = state.encounters;
        this.isLoading = state.isLoading;
        this.hasError = !!state.error;
        this.errorMessage = state.error || '';
        this.currentPage = state.pagination.currentPage;
        this.itemsPerPage = state.pagination.itemsPerPage;
        this.totalItems = state.pagination.totalItems;

        this.updatePaginatedResults();
      });

    // If no selected Pokemon, redirect to search
    if (!this.selectedPokemon && !this.isLoading) {
      this.router.navigate(['/search']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePaginatedResults(): void {
    this.paginatedEncounters = this.stateService.getPaginatedEncounters();
  }

  goBackToSearch(): void {
    this.router.navigate(['/search']);
  }

  getTotalResultsText(): string {
    if (this.totalItems === 0) {
      return 'No encounter locations found';
    }

    if (this.totalItems === 1) {
      return '1 encounter location found';
    }

    return `${this.totalItems} encounter locations found`;
  }

  getGlobalIndex(localIndex: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + localIndex + 1;
  }

  formatLocationName(name: string): string {
    return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatMethodName(name: string): string {
    return name.replace(/-/g, ' ');
  }

  trackByLocation(index: number, encounter: EncounterLocation): string {
    return encounter.location_area.name;
  }

  trackByVersion(index: number, versionDetail: any): string {
    return versionDetail.version.name;
  }
}
