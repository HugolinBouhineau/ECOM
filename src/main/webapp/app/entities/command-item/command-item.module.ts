import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CommandItemComponent } from './list/command-item.component';
import { CommandItemDetailComponent } from './detail/command-item-detail.component';
import { CommandItemUpdateComponent } from './update/command-item-update.component';
import { CommandItemDeleteDialogComponent } from './delete/command-item-delete-dialog.component';
import { CommandItemRoutingModule } from './route/command-item-routing.module';

@NgModule({
  imports: [SharedModule, CommandItemRoutingModule],
  declarations: [CommandItemComponent, CommandItemDetailComponent, CommandItemUpdateComponent, CommandItemDeleteDialogComponent],
})
export class CommandItemModule {}
