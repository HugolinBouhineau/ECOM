import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CommandComponent } from '../list/command.component';
import { CommandDetailComponent } from '../detail/command-detail.component';
import { CommandUpdateComponent } from '../update/command-update.component';
import { CommandRoutingResolveService } from './command-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const commandRoute: Routes = [
  {
    path: '',
    component: CommandComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommandDetailComponent,
    resolve: {
      command: CommandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommandUpdateComponent,
    resolve: {
      command: CommandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommandUpdateComponent,
    resolve: {
      command: CommandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(commandRoute)],
  exports: [RouterModule],
})
export class CommandRoutingModule {}
