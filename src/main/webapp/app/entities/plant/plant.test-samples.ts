import { IPlant, NewPlant } from './plant.model';

export const sampleWithRequiredData: IPlant = {
  id: 48590,
};

export const sampleWithPartialData: IPlant = {
  id: 45933,
  name: 'parse',
  latinName: 'Australia overriding Licensed',
  description: 'Kong microchip feed',
  price: 31868,
  imagePath: 'payment Enterprise-wide deposit',
};

export const sampleWithFullData: IPlant = {
  id: 48986,
  name: 'Optimized Ergonomic',
  latinName: 'protocol synergies',
  description: 'Somoni',
  price: 35518,
  stock: 17020,
  imagePath: 'Direct SMTP',
};

export const sampleWithNewData: NewPlant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
