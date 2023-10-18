import { ICustomer } from 'app/entities/customer/customer.model';

export interface IAddress {
  id: number;
  city?: string | null;
  street?: string | null;
  additionalInfo?: string | null;
  zipCode?: number | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
