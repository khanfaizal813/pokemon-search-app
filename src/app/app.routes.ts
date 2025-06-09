import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search-page/search-page.component').then(m => m.SearchPageComponent),
    title: 'Search Pokemon - Pokemon Encounter Finder'
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/result-page/result-page.component').then(m => m.ResultsPageComponent),
    title: 'Results - Pokemon Encounter Finder'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-page/about-page.component').then(m => m.AboutPageComponent),
    title: 'About - Pokemon Encounter Finder'
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help-page/help-page.component').then(m => m.HelpPageComponent),
    title: 'Help - Pokemon Encounter Finder'
  },
  {
    path: '**',
    redirectTo: '/search'
  }
];
