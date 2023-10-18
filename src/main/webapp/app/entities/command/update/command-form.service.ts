import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICommand, NewCommand } from '../command.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICommand for edit and NewCommandFormGroupInput for create.
 */
type CommandFormGroupInput = ICommand | PartialWithRequiredKeyOf<NewCommand>;

type CommandFormDefaults = Pick<NewCommand, 'id' | 'plants'>;

type CommandFormGroupContent = {
  id: FormControl<ICommand['id'] | NewCommand['id']>;
  state: FormControl<ICommand['state']>;
  purchaseDate: FormControl<ICommand['purchaseDate']>;
  address: FormControl<ICommand['address']>;
  plants: FormControl<ICommand['plants']>;
  customer: FormControl<ICommand['customer']>;
};

export type CommandFormGroup = FormGroup<CommandFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CommandFormService {
  createCommandFormGroup(command: CommandFormGroupInput = { id: null }): CommandFormGroup {
    const commandRawValue = {
      ...this.getFormDefaults(),
      ...command,
    };
    return new FormGroup<CommandFormGroupContent>({
      id: new FormControl(
        { value: commandRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      state: new FormControl(commandRawValue.state),
      purchaseDate: new FormControl(commandRawValue.purchaseDate),
      address: new FormControl(commandRawValue.address),
      plants: new FormControl(commandRawValue.plants ?? []),
      customer: new FormControl(commandRawValue.customer),
    });
  }

  getCommand(form: CommandFormGroup): ICommand | NewCommand {
    return form.getRawValue() as ICommand | NewCommand;
  }

  resetForm(form: CommandFormGroup, command: CommandFormGroupInput): void {
    const commandRawValue = { ...this.getFormDefaults(), ...command };
    form.reset(
      {
        ...commandRawValue,
        id: { value: commandRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CommandFormDefaults {
    return {
      id: null,
      plants: [],
    };
  }
}
