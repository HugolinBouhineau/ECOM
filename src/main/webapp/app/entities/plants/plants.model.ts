import { ICategory } from 'app/entities/category/category.model';
import { ICommand } from 'app/entities/command/command.model';

export interface IPlants {
  id: number;
  name?: string | null;
  latinName?: string | null;
  description?: string | null;
  price?: number | null;
  stock?: number | null;
  imagePath?: string | null;
  categories?: Pick<ICategory, 'id'>[] | null;
  commands?: Pick<ICommand, 'id'>[] | null;
}

export type NewPlants = Omit<IPlants, 'id'> & { id: null };
