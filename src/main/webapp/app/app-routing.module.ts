import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BasketComponent } from './components/basket/basket.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ProductComponent } from './components/product/product.component';
import { EditInformationsComponent } from './components/edit-informations/edit-informations.component';
import { CommandsComponent } from './components/commands/commands.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'basket',
          component: BasketComponent,
        },
        {
          path: 'catalog',
          component: CatalogComponent,
        },
        {
          path: 'commands',
          component: CommandsComponent,
        },
        {
          path: 'editInfos',
          component: EditInformationsComponent,
        },
        {
          path: 'plant/:PlantId',
          component: ProductComponent,
        },
        {
          path: 'payment',
          component: PaymentComponent,
          canActivate: [AuthGuard],
        },
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
