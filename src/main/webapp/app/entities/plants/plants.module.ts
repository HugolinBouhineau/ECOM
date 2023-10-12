import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PlantsComponent } from './list/plants.component';
import { PlantsDetailComponent } from './detail/plants-detail.component';
import { PlantsUpdateComponent } from './update/plants-update.component';
import { PlantsDeleteDialogComponent } from './delete/plants-delete-dialog.component';
import { PlantsRoutingModule } from './route/plants-routing.module';

@NgModule({
  imports: [SharedModule, PlantsRoutingModule],
  declarations: [PlantsComponent, PlantsDetailComponent, PlantsUpdateComponent, PlantsDeleteDialogComponent],
})
export class PlantsModule {}
