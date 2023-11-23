import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPlant, NewPlant } from '../plant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlant for edit and NewPlantFormGroupInput for create.
 */
type PlantFormGroupInput = IPlant | PartialWithRequiredKeyOf<NewPlant>;

type PlantFormDefaults = Pick<NewPlant, 'id' | 'categories'>;

type PlantFormGroupContent = {
  id: FormControl<IPlant['id'] | NewPlant['id']>;
  name: FormControl<IPlant['name']>;
  latinName: FormControl<IPlant['latinName']>;
  description: FormControl<IPlant['description']>;
  price: FormControl<IPlant['price']>;
  stock: FormControl<IPlant['stock']>;
  imagePath: FormControl<IPlant['imagePath']>;
  categories: FormControl<IPlant['categories']>;
};

export type PlantFormGroup = FormGroup<PlantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlantFormService {
  createPlantFormGroup(plant: PlantFormGroupInput = { id: null }): PlantFormGroup {
    const plantRawValue = {
      ...this.getFormDefaults(),
      ...plant,
    };
    return new FormGroup<PlantFormGroupContent>({
      id: new FormControl(
        { value: plantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(plantRawValue.name),
      latinName: new FormControl(plantRawValue.latinName),
      description: new FormControl(plantRawValue.description),
      price: new FormControl(plantRawValue.price),
      stock: new FormControl(plantRawValue.stock),
      imagePath: new FormControl(plantRawValue.imagePath),
      categories: new FormControl(plantRawValue.categories ?? []),
    });
  }

  getPlant(form: PlantFormGroup): IPlant | NewPlant {
    return form.getRawValue() as IPlant | NewPlant;
  }

  resetForm(form: PlantFormGroup, plant: PlantFormGroupInput): void {
    const plantRawValue = { ...this.getFormDefaults(), ...plant };
    form.reset(
      {
        ...plantRawValue,
        id: { value: plantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PlantFormDefaults {
    return {
      id: null,
      categories: [],
    };
  }
}
