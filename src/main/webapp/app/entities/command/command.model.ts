import dayjs from 'dayjs/esm';
import { IPlants } from 'app/entities/plants/plants.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CommandState } from 'app/entities/enumerations/command-state.model';

export interface ICommand {
  id: number;
  address?: string | null;
  state?: CommandState | null;
  purchaseDate?: dayjs.Dayjs | null;
  plants?: Pick<IPlants, 'id'>[] | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewCommand = Omit<ICommand, 'id'> & { id: null };
