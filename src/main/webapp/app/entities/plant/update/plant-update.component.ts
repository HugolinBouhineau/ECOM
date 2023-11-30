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
import { FileHandle } from '../../../drag-ndrop.directive';
import { AzureBlobStorageService } from '../../../azure-blob-storage.service';

@Component({
  selector: 'jhi-plant-update',
  templateUrl: './plant-update.component.html',
})
export class PlantUpdateComponent implements OnInit {
  isSaving = false;
  plant: IPlant | null = null;
  files: FileHandle[] = [];
  files_names: string[] = [];
  saved_files: FileHandle[] = [];
  sas =
    'sp=racwdli&st=2023-11-18T13:43:30Z&se=2024-01-01T21:43:30Z&spr=https&sv=2022-11-02&sr=c&sig=7az5ERRS2B0gz%2F72aHTdDAQgSWu4g53NJDqxPUWiB5Q%3D';

  categoriesSharedCollection: ICategory[] = [];

  editForm: PlantFormGroup = this.plantFormService.createPlantFormGroup();

  constructor(
    protected plantService: PlantService,
    protected plantFormService: PlantFormService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute,
    private blobService: AzureBlobStorageService
  ) {}

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plant }) => {
      this.plant = plant;
      if (plant) {
        this.updateForm(plant);
        let pathlink:string[] | undefined = this.plant?.imagePath?.split("**");
        if (pathlink){
          pathlink.forEach(link => {
            this.files_names.push(link)
          })
        }
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
    let pathname: string = '';
    for (let i = 0; i < this.files_names.length; i++) {
      let file = this.files_names[i];
      pathname = pathname + file;

      if (i != this.files_names.length - 1) {
        pathname = pathname + '**';
      }
    }

    // Upload images to azure using blobServicce
    for (let savedFile of this.saved_files) {
      this.blobService.uploadImage(this.sas, savedFile.file, savedFile.file.name, () => {});
    }

    plant.imagePath = pathname;
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

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }

  upload(): void {
    for (let i = 0; i < this.files.length; i++) {
      this.files_names.push(this.files[i].file.name);
      this.saved_files.push(this.files[i]);
    }
    this.files = [];
  }

  clean_files(): void {
    this.files = [];
    this.files_names = [];
    this.saved_files = [];
  }
}
