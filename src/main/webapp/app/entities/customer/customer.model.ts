import { IUser } from 'app/entities/user/user.model';
import {IAddress} from "../address/address.model";
import {ICommand} from "../command/command.model";

export interface ICustomer {
  id: number;
  user?: Pick<IUser, 'id'> | null;
  commands?: Pick<ICommand, 'id'> | null;
  addresses?: Pick<IAddress, 'id'>[] | null;
}

export type NewCustomer = Omit<ICustomer, 'id'> & { id: null };
