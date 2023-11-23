import { ICategory } from 'app/entities/category/category.model';
import { ICommand } from 'app/entities/command/command.model';

export interface IPlant {
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

export interface PlantQuantity {
  plantId: number;
  plantQuantity: number;
}

export type NewPlant = Omit<IPlant, 'id'> & { id: null };
