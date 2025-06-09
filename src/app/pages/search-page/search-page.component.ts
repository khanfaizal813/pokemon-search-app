import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, NavigationComponent, SearchComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navigation></app-navigation>

      <main class="container mx-auto px-4 py-8">
        <app-search></app-search>
      </main>

      <!-- Background Decoration -->
      <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-32 h-32 bg-pokemon-yellow bg-opacity-10 rounded-full blur-xl"></div>
        <div class="absolute top-40 right-20 w-48 h-48 bg-pokemon-blue bg-opacity-10 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 left-1/2 w-64 h-64 bg-pokemon-red bg-opacity-10 rounded-full blur-xl"></div>
      </div>
    </div>
  `
})
export class SearchPageComponent { }
