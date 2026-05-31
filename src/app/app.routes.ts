import { Routes } from '@angular/router';

import { Dashboard } from './components/dashboard/dashboard';
import { ProductsComponent } from './components/products/products';

export const routes: Routes = [

  {
    path: '',
    component: Dashboard
  },

  {
    path: 'products',
    component: ProductsComponent
  }

];