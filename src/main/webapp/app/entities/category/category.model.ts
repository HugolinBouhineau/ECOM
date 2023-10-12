import { IPlants } from 'app/entities/plants/plants.model';

export interface ICategory {
  id: number;
  categoryName?: string | null;
  plants?: Pick<IPlants, 'id'>[] | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
