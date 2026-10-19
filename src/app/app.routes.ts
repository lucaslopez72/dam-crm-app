
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'galeria',
    loadComponent: () =>
      import('./galeria/galeria.page').then(m => m.GaleriaPage)
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./clientes/clientes.page').then(m => m.ClientesPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
