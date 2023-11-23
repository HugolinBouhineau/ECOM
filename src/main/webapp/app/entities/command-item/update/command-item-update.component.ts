import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CommandItemFormService, CommandItemFormGroup } from './command-item-form.service';
import { ICommandItem } from '../command-item.model';
import { CommandItemService } from '../service/command-item.service';
import { ICommand } from 'app/entities/command/command.model';
import { CommandService } from 'app/entities/command/service/command.service';
import { IPlant } from 'app/entities/plant/plant.model';
import { PlantService } from 'app/entities/plant/service/plant.service';

@Component({
  selector: 'jhi-command-item-update',
  templateUrl: './command-item-update.component.html',
})
export class CommandItemUpdateComponent implements OnInit {
  isSaving = false;
  commandItem: ICommandItem | null = null;

  commandsSharedCollection: ICommand[] = [];
  plantsSharedCollection: IPlant[] = [];

  editForm: CommandItemFormGroup = this.commandItemFormService.createCommandItemFormGroup();

  constructor(
    protected commandItemService: CommandItemService,
    protected commandItemFormService: CommandItemFormService,
    protected commandService: CommandService,
    protected plantService: PlantService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCommand = (o1: ICommand | null, o2: ICommand | null): boolean => this.commandService.compareCommand(o1, o2);

  comparePlant = (o1: IPlant | null, o2: IPlant | null): boolean => this.plantService.comparePlant(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commandItem }) => {
      this.commandItem = commandItem;
      if (commandItem) {
        this.updateForm(commandItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commandItem = this.commandItemFormService.getCommandItem(this.editForm);
    if (commandItem.id !== null) {
      this.subscribeToSaveResponse(this.commandItemService.update(commandItem));
    } else {
      this.subscribeToSaveResponse(this.commandItemService.create(commandItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommandItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(commandItem: ICommandItem): void {
    this.commandItem = commandItem;
    this.commandItemFormService.resetForm(this.editForm, commandItem);

    this.commandsSharedCollection = this.commandService.addCommandToCollectionIfMissing<ICommand>(
      this.commandsSharedCollection,
      commandItem.command
    );
    this.plantsSharedCollection = this.plantService.addPlantToCollectionIfMissing<IPlant>(this.plantsSharedCollection, commandItem.plant);
  }

  protected loadRelationshipsOptions(): void {
    this.commandService
      .query()
      .pipe(map((res: HttpResponse<ICommand[]>) => res.body ?? []))
      .pipe(
        map((commands: ICommand[]) => this.commandService.addCommandToCollectionIfMissing<ICommand>(commands, this.commandItem?.command))
      )
      .subscribe((commands: ICommand[]) => (this.commandsSharedCollection = commands));

    this.plantService
      .query()
      .pipe(map((res: HttpResponse<IPlant[]>) => res.body ?? []))
      .pipe(map((plants: IPlant[]) => this.plantService.addPlantToCollectionIfMissing<IPlant>(plants, this.commandItem?.plant)))
      .subscribe((plants: IPlant[]) => (this.plantsSharedCollection = plants));
  }
}
