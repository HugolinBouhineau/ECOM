import { ICommandItem, NewCommandItem } from './command-item.model';

export const sampleWithRequiredData: ICommandItem = {
  id: 93883,
};

export const sampleWithPartialData: ICommandItem = {
  id: 45198,
  quantity: 5818,
};

export const sampleWithFullData: ICommandItem = {
  id: 20985,
  quantity: 24098,
};

export const sampleWithNewData: NewCommandItem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
