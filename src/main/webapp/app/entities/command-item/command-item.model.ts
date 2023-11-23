import { ICommand } from 'app/entities/command/command.model';
import { IPlant } from 'app/entities/plant/plant.model';

export interface ICommandItem {
  id: number;
  quantity?: number | null;
  command?: Pick<ICommand, 'id'> | null;
  plant?: Pick<IPlant, 'id'> | null;
}

export type NewCommandItem = Omit<ICommandItem, 'id'> & { id: null };
