import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { ResultsComponent } from '../../components/results/results.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule, NavigationComponent, ResultsComponent, PaginatorComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navigation></app-navigation>

      <main class="container mx-auto px-4 py-8">
        <app-results></app-results>
        <app-paginator></app-paginator>
      </main>

      <!-- Background Decoration -->
      <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div class="absolute top-32 right-10 w-40 h-40 bg-pokemon-blue bg-opacity-10 rounded-full blur-xl"></div>
        <div class="absolute bottom-32 left-16 w-56 h-56 bg-pokemon-red bg-opacity-10 rounded-full blur-xl"></div>
      </div>
    </div>
  `
})
export class ResultsPageComponent { }
