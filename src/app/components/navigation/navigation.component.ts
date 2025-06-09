import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { NavigationItem } from '../../models/pokemon.interface';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg border-b-4 border-pokemon-red sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-pokemon-red rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg">P</span>
            </div>
            <span class="text-xl font-bold text-gray-900">Pokemon Search</span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <a
              *ngFor="let item of visibleItems; trackBy: trackByRoute"
              [routerLink]="item.route"
              [class]="getLinkClasses(item.route)"
              class="px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
            >
              {{ item.label }}
            </a>
          </div>

          <!-- Mobile/Overflow Menu Button -->
          <div class="md:hidden relative">
            <button
              (click)="toggleMobileMenu()"
              class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              [attr.aria-expanded]="isMobileMenuOpen"
              aria-label="Toggle navigation menu"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  [attr.d]="isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Desktop Overflow Menu -->
          <div
            *ngIf="hiddenItems.length > 0"
            class="hidden md:block relative"
          >
            <button
              (click)="toggleDropdown()"
              class="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-pokemon-red transition-colors duration-200"
              [attr.aria-expanded]="isDropdownOpen"
            >
              <span>More</span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                [class.rotate-180]="isDropdownOpen"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Desktop Dropdown Menu -->
            <div
              *ngIf="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-slide-down"
              (click)="closeDropdown()"
            >
              <a
                *ngFor="let item of hiddenItems; trackBy: trackByRoute"
                [routerLink]="item.route"
                [class]="getDropdownLinkClasses(item.route)"
                class="block px-4 py-2 text-sm transition-colors duration-200"
              >
                {{ item.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div
          *ngIf="isMobileMenuOpen"
          class="md:hidden border-t border-gray-200 py-4 animate-slide-down"
        >
          <div class="space-y-2">
            <a
              *ngFor="let item of navigationItems; trackBy: trackByRoute"
              [routerLink]="item.route"
              [class]="getMobileLinkClasses(item.route)"
              class="block px-3 py-2 rounded-lg font-medium transition-all duration-200"
              (click)="closeMobileMenu()"
            >
              {{ item.label }}
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class NavigationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  navigationItems: NavigationItem[] = [
    { label: 'Search Pokemon', route: '/search' },
    { label: 'Results', route: '/results' },
    { label: 'About', route: '/about' },
    { label: 'Help', route: '/help' }
  ];

  visibleItems: NavigationItem[] = [];
  hiddenItems: NavigationItem[] = [];
  currentRoute = '';
  isMobileMenuOpen = false;
  isDropdownOpen = false;
  screenWidth = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateScreenWidth();
    this.calculateVisibleItems();

    // Listen to route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.closeMobileMenu();
        this.closeDropdown();
      });

    // Set initial route
    this.currentRoute = this.router.url;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateScreenWidth();
    this.calculateVisibleItems();

    // Close menus on resize
    if (this.screenWidth >= 768) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.closeDropdown();
    }
  }

  private updateScreenWidth(): void {
    this.screenWidth = window.innerWidth;
  }

  private calculateVisibleItems(): void {
    // On mobile, all items go to mobile menu
    if (this.screenWidth < 768) {
      this.visibleItems = [];
      this.hiddenItems = [];
      return;
    }

    // Calculate how many items can fit based on screen width
    const availableWidth = this.screenWidth - 400; // Reserve space for logo and margins
    const itemWidth = 120; // Approximate width per nav item
    const maxVisibleItems = Math.floor(availableWidth / itemWidth);

    const itemsToShow = Math.min(maxVisibleItems, this.navigationItems.length);

    this.visibleItems = this.navigationItems.slice(0, itemsToShow);
    this.hiddenItems = this.navigationItems.slice(itemsToShow);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.closeDropdown();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  getLinkClasses(route: string): string {
    const baseClasses = 'text-gray-700 hover:text-pokemon-red hover:bg-gray-50';
    const activeClasses = 'text-pokemon-red bg-red-50 border border-pokemon-red border-opacity-20';

    return this.isActiveRoute(route) ? activeClasses : baseClasses;
  }

  getDropdownLinkClasses(route: string): string {
    const baseClasses = 'text-gray-700 hover:text-pokemon-red hover:bg-gray-50';
    const activeClasses = 'text-pokemon-red bg-red-50';

    return this.isActiveRoute(route) ? activeClasses : baseClasses;
  }

  getMobileLinkClasses(route: string): string {
    const baseClasses = 'text-gray-700 hover:text-pokemon-red hover:bg-gray-50';
    const activeClasses = 'text-pokemon-red bg-red-50 border border-pokemon-red border-opacity-20';

    return this.isActiveRoute(route) ? activeClasses : baseClasses;
  }

  private isActiveRoute(route: string): boolean {
    if (route === '/search' && (this.currentRoute === '/' || this.currentRoute === '/search')) {
      return true;
    }
    return this.currentRoute === route;
  }

  trackByRoute(index: number, item: NavigationItem): string {
    return item.route;
  }
}
