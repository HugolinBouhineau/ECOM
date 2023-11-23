import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'plant',
        data: { pageTitle: 'ecomApp.plant.home.title' },
        loadChildren: () => import('./plant/plant.module').then(m => m.PlantModule),
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
      {
        path: 'address',
        data: { pageTitle: 'ecomApp.address.home.title' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'command-item',
        data: { pageTitle: 'ecomApp.commandItem.home.title' },
        loadChildren: () => import('./command-item/command-item.module').then(m => m.CommandItemModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
