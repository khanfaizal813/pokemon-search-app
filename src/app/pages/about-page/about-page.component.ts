import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../../components/navigation/navigation.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navigation></app-navigation>

      <main class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="card p-8 animate-fade-in">
            <h1 class="text-4xl font-bold text-gray-900 mb-6">About Pokemon Search</h1>

            <div class="prose prose-lg max-w-none">
              <p class="text-xl text-gray-600 mb-8">
                Discover where your favorite Pokemon can be found in the wild with our comprehensive encounter location database.
              </p>

              <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
                  <ul class="space-y-3 text-gray-700">
                    <li class="flex items-start space-x-3">
                      <svg class="w-5 h-5 text-pokemon-red mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Search over 1000 Pokemon with intelligent autosuggest</span>
                    </li>
                    <li class="flex items-start space-x-3">
                      <svg class="w-5 h-5 text-pokemon-red mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Detailed encounter information including levels and methods</span>
                    </li>
                    <li class="flex items-start space-x-3">
                      <svg class="w-5 h-5 text-pokemon-red mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Game version specific encounter data</span>
                    </li>
                    <li class="flex items-start space-x-3">
                      <svg class="w-5 h-5 text-pokemon-red mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Responsive design for desktop and mobile</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">Technology</h2>
                  <ul class="space-y-3 text-gray-700">
                    <li class="flex items-start space-x-3">
                      <svg class="w-5 h-5 text-pokemon-blue mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Built with Angular 19 and TypeScript</span>
                    </li>
                    <li class="flex items-start space-x-3">
                      <svg class="w-5 h-5 text-pokemon-blue mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Styled with Tailwind CSS for modern design</span>
                    </li>
                    <li class="flex items-start space-x-3">
                      <svg class="w-5 h-5 text-pokemon-blue mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Powered by PokeAPI for reliable data</span>
                    </li>
                    <li class="flex items-start space-x-3">
                      <svg class="w-5 h-5 text-pokemon-blue mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>State management with RxJS and services</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
                <ol class="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Enter a Pokemon name in the search box with intelligent autosuggest</li>
                  <li>Select from the dropdown or click search to find encounter locations</li>
                  <li>Browse detailed results with game versions, encounter rates, and methods</li>
                  <li>Use pagination to navigate through large result sets</li>
                  <li>Your search state is preserved when navigating between pages</li>
                </ol>
              </div>

              <div class="text-center">
                <a
                  routerLink="/search"
                  class="btn-primary inline-flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span>Start Searching Pokemon</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AboutPageComponent { }
