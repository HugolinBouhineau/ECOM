import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CommandComponent } from './list/command.component';
import { CommandDetailComponent } from './detail/command-detail.component';
import { CommandUpdateComponent } from './update/command-update.component';
import { CommandDeleteDialogComponent } from './delete/command-delete-dialog.component';
import { CommandRoutingModule } from './route/command-routing.module';

@NgModule({
  imports: [SharedModule, CommandRoutingModule],
  declarations: [CommandComponent, CommandDetailComponent, CommandUpdateComponent, CommandDeleteDialogComponent],
})
export class CommandModule {}
