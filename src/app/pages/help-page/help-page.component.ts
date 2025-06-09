import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../../components/navigation/navigation.component';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navigation></app-navigation>

      <main class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="card p-8 animate-fade-in">
            <h1 class="text-4xl font-bold text-gray-900 mb-6">Help & FAQ</h1>

            <div class="space-y-8">
              <!-- Search Help -->
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">How to Search</h2>
                <div class="bg-gray-50 rounded-lg p-6 mb-4">
                  <h3 class="font-semibold text-gray-900 mb-2">Using the Search Box</h3>
                  <ul class="list-disc list-inside space-y-2 text-gray-700">
                    <li>Type any Pokemon name to see intelligent suggestions</li>
                    <li>Use arrow keys to navigate suggestions, Enter to select</li>
                    <li>Click on suggestions or type the full name and search</li>
                    <li>Names are case-insensitive (pikachu = Pikachu = PIKACHU)</li>
                  </ul>
                </div>
              </div>

              <!-- FAQ Section -->
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>

                <div class="space-y-6">
                  <div class="border-l-4 border-pokemon-red pl-4">
                    <h3 class="font-semibold text-gray-900 mb-2">Why doesn't my Pokemon have any encounters?</h3>
                    <p class="text-gray-700">
                      Some Pokemon are only available through special events, breeding, evolution, or trading.
                      Legendary and mythical Pokemon often don't have wild encounters in most games.
                    </p>
                  </div>

                  <div class="border-l-4 border-pokemon-blue pl-4">
                    <h3 class="font-semibold text-gray-900 mb-2">What do the encounter percentages mean?</h3>
                    <p class="text-gray-700">
                      The percentage shows the maximum encounter rate for that Pokemon in that location across
                      all available methods. Higher percentages mean you're more likely to find the Pokemon there.
                    </p>
                  </div>

                  <div class="border-l-4 border-pokemon-yellow pl-4">
                    <h3 class="font-semibold text-gray-900 mb-2">Why are there different game versions?</h3>
                    <p class="text-gray-700">
                      Pokemon encounter data varies between game versions. Some Pokemon might be available
                      in one version but not another, or have different encounter rates and locations.
                    </p>
                  </div>

                  <div class="border-l-4 border-green-500 pl-4">
                    <h3 class="font-semibold text-gray-900 mb-2">What do the encounter methods mean?</h3>
                    <p class="text-gray-700">
                      Different methods include walking in grass, surfing on water, fishing with different rods,
                      walking in caves, or other special conditions required to encounter the Pokemon.
                    </p>
                  </div>

                  <div class="border-l-4 border-purple-500 pl-4">
                    <h3 class="font-semibold text-gray-900 mb-2">How current is the data?</h3>
                    <p class="text-gray-700">
                      All data comes from the official PokeAPI, which is regularly updated with the latest
                      Pokemon game information. However, very recent games might take time to be included.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Tips Section -->
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Pro Tips</h2>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="bg-blue-50 rounded-lg p-4">
                    <h3 class="font-semibold text-blue-900 mb-2">Keyboard Shortcuts</h3>
                    <ul class="text-blue-800 text-sm space-y-1">
                      <li>↑/↓ arrows: Navigate suggestions</li>
                      <li>Enter: Select suggestion or search</li>
                      <li>Escape: Close suggestions</li>
                    </ul>
                  </div>

                  <div class="bg-green-50 rounded-lg p-4">
                    <h3 class="font-semibold text-green-900 mb-2">Search Tips</h3>
                    <ul class="text-green-800 text-sm space-y-1">
                      <li>Try partial names for suggestions</li>
                      <li>Use the popular searches for quick access</li>
                      <li>State is saved when you navigate back</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Troubleshooting -->
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
                <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 class="font-semibold text-red-900 mb-3">Common Issues</h3>
                  <div class="space-y-3 text-red-800">
                    <div>
                      <strong>Search not working:</strong> Check your internet connection and try refreshing the page.
                    </div>
                    <div>
                      <strong>Slow loading:</strong> The Pokemon API might be experiencing high traffic. Please wait a moment and try again.
                    </div>
                    <div>
                      <strong>Pokemon not found:</strong> Double-check the spelling or try searching for a similar Pokemon name.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact -->
              <div class="text-center bg-gray-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Need More Help?</h2>
                <p class="text-gray-700 mb-6">
                  If you're still having issues or have suggestions for improvement,
                  we'd love to hear from you!
                </p>
                <a
                  routerLink="/search"
                  class="btn-primary inline-flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span>Start Searching</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class HelpPageComponent { }
