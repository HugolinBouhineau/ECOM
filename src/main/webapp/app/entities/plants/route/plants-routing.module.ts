import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlantsComponent } from '../list/plants.component';
import { PlantsDetailComponent } from '../detail/plants-detail.component';
import { PlantsUpdateComponent } from '../update/plants-update.component';
import { PlantsRoutingResolveService } from './plants-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const plantsRoute: Routes = [
  {
    path: '',
    component: PlantsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlantsDetailComponent,
    resolve: {
      plants: PlantsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlantsUpdateComponent,
    resolve: {
      plants: PlantsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlantsUpdateComponent,
    resolve: {
      plants: PlantsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(plantsRoute)],
  exports: [RouterModule],
})
export class PlantsRoutingModule {}
