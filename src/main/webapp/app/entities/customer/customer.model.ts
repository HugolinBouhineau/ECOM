import { IUser } from 'app/entities/user/user.model';

export interface ICustomer {
  id: number;
  user?: Pick<IUser, 'id'> | null;
}

export type NewCustomer = Omit<ICustomer, 'id'> & { id: null };
