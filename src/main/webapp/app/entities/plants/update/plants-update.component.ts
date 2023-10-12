import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PlantsFormService, PlantsFormGroup } from './plants-form.service';
import { IPlants } from '../plants.model';
import { PlantsService } from '../service/plants.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

@Component({
  selector: 'jhi-plants-update',
  templateUrl: './plants-update.component.html',
})
export class PlantsUpdateComponent implements OnInit {
  isSaving = false;
  plants: IPlants | null = null;

  categoriesSharedCollection: ICategory[] = [];

  editForm: PlantsFormGroup = this.plantsFormService.createPlantsFormGroup();

  constructor(
    protected plantsService: PlantsService,
    protected plantsFormService: PlantsFormService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plants }) => {
      this.plants = plants;
      if (plants) {
        this.updateForm(plants);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const plants = this.plantsFormService.getPlants(this.editForm);
    if (plants.id !== null) {
      this.subscribeToSaveResponse(this.plantsService.update(plants));
    } else {
      this.subscribeToSaveResponse(this.plantsService.create(plants));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlants>>): void {
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

  protected updateForm(plants: IPlants): void {
    this.plants = plants;
    this.plantsFormService.resetForm(this.editForm, plants);

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
      this.categoriesSharedCollection,
      ...(plants.categories ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing<ICategory>(categories, ...(this.plants?.categories ?? []))
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));
  }
}
