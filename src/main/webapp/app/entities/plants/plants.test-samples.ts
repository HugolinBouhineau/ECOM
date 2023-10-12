import { IPlants, NewPlants } from './plants.model';

export const sampleWithRequiredData: IPlants = {
  id: 122,
};

export const sampleWithPartialData: IPlants = {
  id: 82171,
  latinName: 'ROI the',
  description: 'Senior',
  stock: 20113,
};

export const sampleWithFullData: IPlants = {
  id: 92008,
  name: 'system transition',
  latinName: 'Dollar Extended Music',
  description: 'Intelligent Concrete withdrawal',
  price: 94196,
  stock: 30521,
  imagePath: 'Plastic',
};

export const sampleWithNewData: NewPlants = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
