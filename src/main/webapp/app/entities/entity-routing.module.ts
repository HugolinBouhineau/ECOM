import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'plants',
        data: { pageTitle: 'ecomApp.plants.home.title' },
        loadChildren: () => import('./plants/plants.module').then(m => m.PlantsModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'ecomApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'command',
        data: { pageTitle: 'ecomApp.command.home.title' },
        loadChildren: () => import('./command/command.module').then(m => m.CommandModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'ecomApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
