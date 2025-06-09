import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { StateService } from '../../services/state.service';
import { PaginationConfig } from '../../models/pokemon.interface';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 animate-fade-in">
      <!-- Results Info -->
      <div class="text-sm text-gray-600">
        Showing {{ getStartItem() }}-{{ getEndItem() }} of {{ totalItems }} results
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center space-x-2">
        <!-- First Page -->
        <button
          (click)="goToPage(1)"
          [disabled]="currentPage === 1"
          class="pagination-btn"
          [class.disabled]="currentPage === 1"
          title="First page"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>

        <!-- Previous Page -->
        <button
          (click)="goToPage(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="pagination-btn"
          [class.disabled]="currentPage === 1"
          title="Previous page"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center space-x-1">
          <button
            *ngFor="let page of getVisiblePages(); trackBy: trackByPage"
            (click)="goToPage(page)"
            [class]="getPageButtonClasses(page)"
            class="pagination-btn min-w-[40px]"
          >
            {{ page === -1 ? '...' : page }}
          </button>
        </div>

        <!-- Next Page -->
        <button
          (click)="goToPage(currentPage + 1)"
          [disabled]="currentPage === totalPages"
          class="pagination-btn"
          [class.disabled]="currentPage === totalPages"
          title="Next page"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <!-- Last Page -->
        <button
          (click)="goToPage(totalPages)"
          [disabled]="currentPage === totalPages"
          class="pagination-btn"
          [class.disabled]="currentPage === totalPages"
          title="Last page"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Items Per Page Selector -->
      <div class="flex items-center space-x-2 text-sm">
        <label for="itemsPerPage" class="text-gray-600">Show:</label>
        <select
          id="itemsPerPage"
          [value]="itemsPerPage"
          (change)="changeItemsPerPage($event)"
          class="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-pokemon-blue focus:border-transparent"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span class="text-gray-600">per page</span>
      </div>
    </div>
  `,
  styles: [`
    .pagination-btn {
      @apply px-3 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all duration-200 rounded-md;
    }

    .pagination-btn.disabled {
      @apply opacity-50 cursor-not-allowed hover:bg-white;
    }

    .pagination-btn.active {
      @apply bg-pokemon-red text-white border-pokemon-red hover:bg-red-600;
    }

    .pagination-btn.ellipsis {
      @apply cursor-default hover:bg-white;
    }
  `]
})
export class PaginatorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.stateService.getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.currentPage = state.pagination.currentPage;
        this.itemsPerPage = state.pagination.itemsPerPage;
        this.totalItems = state.pagination.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToPage(page: number): void {
    if (page === -1 || page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.stateService.setPagination({ currentPage: page });
  }

  changeItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newItemsPerPage = parseInt(target.value, 10);

    // Calculate what the new current page should be to keep the user roughly in the same place
    const currentFirstItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const newCurrentPage = Math.ceil(currentFirstItem / newItemsPerPage);

    this.stateService.setPagination({
      itemsPerPage: newItemsPerPage,
      currentPage: Math.max(1, newCurrentPage)
    });
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 7;

    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const start = Math.max(2, this.currentPage - 2);
      const end = Math.min(this.totalPages - 1, this.currentPage + 2);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < this.totalPages - 1) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Always show last page
      if (this.totalPages > 1) {
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  getPageButtonClasses(page: number): string {
    if (page === -1) {
      return 'ellipsis';
    }

    return page === this.currentPage ? 'active' : '';
  }

  getStartItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  trackByPage(index: number, page: number): number {
    return page;
  }
}
