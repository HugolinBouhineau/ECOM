import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PlantFormService, PlantFormGroup } from './plant-form.service';
import { IPlant } from '../plant.model';
import { PlantService } from '../service/plant.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

@Component({
  selector: 'jhi-plant-update',
  templateUrl: './plant-update.component.html',
})
export class PlantUpdateComponent implements OnInit {
  isSaving = false;
  plant: IPlant | null = null;

  categoriesSharedCollection: ICategory[] = [];

  editForm: PlantFormGroup = this.plantFormService.createPlantFormGroup();

  constructor(
    protected plantService: PlantService,
    protected plantFormService: PlantFormService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plant }) => {
      this.plant = plant;
      if (plant) {
        this.updateForm(plant);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const plant = this.plantFormService.getPlant(this.editForm);
    if (plant.id !== null) {
      this.subscribeToSaveResponse(this.plantService.update(plant));
    } else {
      this.subscribeToSaveResponse(this.plantService.create(plant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlant>>): void {
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

  protected updateForm(plant: IPlant): void {
    this.plant = plant;
    this.plantFormService.resetForm(this.editForm, plant);

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
      this.categoriesSharedCollection,
      ...(plant.categories ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing<ICategory>(categories, ...(this.plant?.categories ?? []))
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));
  }
}
