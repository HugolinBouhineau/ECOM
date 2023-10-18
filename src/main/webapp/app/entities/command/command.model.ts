import dayjs from 'dayjs/esm';
import { IAddress } from 'app/entities/address/address.model';
import { IPlant } from 'app/entities/plant/plant.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CommandState } from 'app/entities/enumerations/command-state.model';

export interface ICommand {
  id: number;
  state?: CommandState | null;
  purchaseDate?: dayjs.Dayjs | null;
  address?: Pick<IAddress, 'id'> | null;
  plants?: Pick<IPlant, 'id'>[] | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewCommand = Omit<ICommand, 'id'> & { id: null };
