import dayjs from 'dayjs/esm';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IAddress } from 'app/entities/address/address.model';
import { CommandState } from 'app/entities/enumerations/command-state.model';

export interface ICommand {
  id: number;
  state?: CommandState | null;
  purchaseDate?: dayjs.Dayjs | null;
  customer?: Pick<ICustomer, 'id'> | null;
  address?: Pick<IAddress, 'id'> | null;
}

export type NewCommand = Omit<ICommand, 'id'> & { id: null };
