import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 88754,
};

export const sampleWithPartialData: IAddress = {
  id: 72042,
  city: 'Paucekport',
  street: 'Sophie Crossroad',
};

export const sampleWithFullData: IAddress = {
  id: 46497,
  city: 'Port Robynside',
  street: 'Klocko Viaduct',
  additionalInfo: 'Colorado Buckinghamshire',
  zipCode: 42632,
};

export const sampleWithNewData: NewAddress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
