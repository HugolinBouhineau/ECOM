import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlantComponent } from '../list/plant.component';
import { PlantDetailComponent } from '../detail/plant-detail.component';
import { PlantUpdateComponent } from '../update/plant-update.component';
import { PlantRoutingResolveService } from './plant-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const plantRoute: Routes = [
  {
    path: '',
    component: PlantComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlantDetailComponent,
    resolve: {
      plant: PlantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlantUpdateComponent,
    resolve: {
      plant: PlantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlantUpdateComponent,
    resolve: {
      plant: PlantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(plantRoute)],
  exports: [RouterModule],
})
export class PlantRoutingModule {}
