import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CommandFormService, CommandFormGroup } from './command-form.service';
import { ICommand } from '../command.model';
import { CommandService } from '../service/command.service';
import { IPlants } from 'app/entities/plants/plants.model';
import { PlantsService } from 'app/entities/plants/service/plants.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { CommandState } from 'app/entities/enumerations/command-state.model';

@Component({
  selector: 'jhi-command-update',
  templateUrl: './command-update.component.html',
})
export class CommandUpdateComponent implements OnInit {
  isSaving = false;
  command: ICommand | null = null;
  commandStateValues = Object.keys(CommandState);

  plantsSharedCollection: IPlants[] = [];
  customersSharedCollection: ICustomer[] = [];

  editForm: CommandFormGroup = this.commandFormService.createCommandFormGroup();

  constructor(
    protected commandService: CommandService,
    protected commandFormService: CommandFormService,
    protected plantsService: PlantsService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePlants = (o1: IPlants | null, o2: IPlants | null): boolean => this.plantsService.comparePlants(o1, o2);

  compareCustomer = (o1: ICustomer | null, o2: ICustomer | null): boolean => this.customerService.compareCustomer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ command }) => {
      this.command = command;
      if (command) {
        this.updateForm(command);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const command = this.commandFormService.getCommand(this.editForm);
    if (command.id !== null) {
      this.subscribeToSaveResponse(this.commandService.update(command));
    } else {
      this.subscribeToSaveResponse(this.commandService.create(command));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommand>>): void {
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

  protected updateForm(command: ICommand): void {
    this.command = command;
    this.commandFormService.resetForm(this.editForm, command);

    this.plantsSharedCollection = this.plantsService.addPlantsToCollectionIfMissing<IPlants>(
      this.plantsSharedCollection,
      ...(command.plants ?? [])
    );
    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing<ICustomer>(
      this.customersSharedCollection,
      command.customer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.plantsService
      .query()
      .pipe(map((res: HttpResponse<IPlants[]>) => res.body ?? []))
      .pipe(map((plants: IPlants[]) => this.plantsService.addPlantsToCollectionIfMissing<IPlants>(plants, ...(this.command?.plants ?? []))))
      .subscribe((plants: IPlants[]) => (this.plantsSharedCollection = plants));

    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) => this.customerService.addCustomerToCollectionIfMissing<ICustomer>(customers, this.command?.customer))
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }
}
