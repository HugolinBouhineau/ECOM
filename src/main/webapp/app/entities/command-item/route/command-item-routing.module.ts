import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CommandItemComponent } from '../list/command-item.component';
import { CommandItemDetailComponent } from '../detail/command-item-detail.component';
import { CommandItemUpdateComponent } from '../update/command-item-update.component';
import { CommandItemRoutingResolveService } from './command-item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const commandItemRoute: Routes = [
  {
    path: '',
    component: CommandItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommandItemDetailComponent,
    resolve: {
      commandItem: CommandItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommandItemUpdateComponent,
    resolve: {
      commandItem: CommandItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommandItemUpdateComponent,
    resolve: {
      commandItem: CommandItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(commandItemRoute)],
  exports: [RouterModule],
})
export class CommandItemRoutingModule {}
