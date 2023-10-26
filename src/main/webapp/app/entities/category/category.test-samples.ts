import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: 2529,
};

export const sampleWithPartialData: ICategory = {
  id: 98520,
  categoryName: 'Sausages',
  categoryType: 77300,
};

export const sampleWithFullData: ICategory = {
  id: 554,
  categoryName: 'USB Down-sized Principal',
  categoryType: 35731,
};

export const sampleWithNewData: NewCategory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
