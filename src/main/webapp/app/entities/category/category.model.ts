import { IPlant } from 'app/entities/plant/plant.model';

export interface ICategory {
  id: number;
  categoryName?: string | null;
  plants?: Pick<IPlant, 'id'>[] | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
