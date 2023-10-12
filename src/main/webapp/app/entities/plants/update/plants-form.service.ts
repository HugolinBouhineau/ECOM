import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPlants, NewPlants } from '../plants.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlants for edit and NewPlantsFormGroupInput for create.
 */
type PlantsFormGroupInput = IPlants | PartialWithRequiredKeyOf<NewPlants>;

type PlantsFormDefaults = Pick<NewPlants, 'id' | 'categories' | 'commands'>;

type PlantsFormGroupContent = {
  id: FormControl<IPlants['id'] | NewPlants['id']>;
  name: FormControl<IPlants['name']>;
  latinName: FormControl<IPlants['latinName']>;
  description: FormControl<IPlants['description']>;
  price: FormControl<IPlants['price']>;
  stock: FormControl<IPlants['stock']>;
  imagePath: FormControl<IPlants['imagePath']>;
  categories: FormControl<IPlants['categories']>;
  commands: FormControl<IPlants['commands']>;
};

export type PlantsFormGroup = FormGroup<PlantsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlantsFormService {
  createPlantsFormGroup(plants: PlantsFormGroupInput = { id: null }): PlantsFormGroup {
    const plantsRawValue = {
      ...this.getFormDefaults(),
      ...plants,
    };
    return new FormGroup<PlantsFormGroupContent>({
      id: new FormControl(
        { value: plantsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(plantsRawValue.name),
      latinName: new FormControl(plantsRawValue.latinName),
      description: new FormControl(plantsRawValue.description),
      price: new FormControl(plantsRawValue.price),
      stock: new FormControl(plantsRawValue.stock),
      imagePath: new FormControl(plantsRawValue.imagePath),
      categories: new FormControl(plantsRawValue.categories ?? []),
      commands: new FormControl(plantsRawValue.commands ?? []),
    });
  }

  getPlants(form: PlantsFormGroup): IPlants | NewPlants {
    return form.getRawValue() as IPlants | NewPlants;
  }

  resetForm(form: PlantsFormGroup, plants: PlantsFormGroupInput): void {
    const plantsRawValue = { ...this.getFormDefaults(), ...plants };
    form.reset(
      {
        ...plantsRawValue,
        id: { value: plantsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PlantsFormDefaults {
    return {
      id: null,
      categories: [],
      commands: [],
    };
  }
}
