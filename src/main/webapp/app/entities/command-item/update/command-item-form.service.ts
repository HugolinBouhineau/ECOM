import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICommandItem, NewCommandItem } from '../command-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICommandItem for edit and NewCommandItemFormGroupInput for create.
 */
type CommandItemFormGroupInput = ICommandItem | PartialWithRequiredKeyOf<NewCommandItem>;

type CommandItemFormDefaults = Pick<NewCommandItem, 'id'>;

type CommandItemFormGroupContent = {
  id: FormControl<ICommandItem['id'] | NewCommandItem['id']>;
  quantity: FormControl<ICommandItem['quantity']>;
  command: FormControl<ICommandItem['command']>;
  plant: FormControl<ICommandItem['plant']>;
};

export type CommandItemFormGroup = FormGroup<CommandItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CommandItemFormService {
  createCommandItemFormGroup(commandItem: CommandItemFormGroupInput = { id: null }): CommandItemFormGroup {
    const commandItemRawValue = {
      ...this.getFormDefaults(),
      ...commandItem,
    };
    return new FormGroup<CommandItemFormGroupContent>({
      id: new FormControl(
        { value: commandItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      quantity: new FormControl(commandItemRawValue.quantity),
      command: new FormControl(commandItemRawValue.command),
      plant: new FormControl(commandItemRawValue.plant),
    });
  }

  getCommandItem(form: CommandItemFormGroup): ICommandItem | NewCommandItem {
    return form.getRawValue() as ICommandItem | NewCommandItem;
  }

  resetForm(form: CommandItemFormGroup, commandItem: CommandItemFormGroupInput): void {
    const commandItemRawValue = { ...this.getFormDefaults(), ...commandItem };
    form.reset(
      {
        ...commandItemRawValue,
        id: { value: commandItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CommandItemFormDefaults {
    return {
      id: null,
    };
  }
}
