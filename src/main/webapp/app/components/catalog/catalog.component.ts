import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../entities/category/service/category.service';
import { ICategory } from '../../entities/category/category.model';
import { PlantService } from '../../entities/plant/service/plant.service';
import { IPlant } from '../../entities/plant/plant.model';

@Component({
  selector: 'jhi-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  categories: ICategory[] = [];
  categoryTypes: (number | null | undefined)[] = [];
  plants: IPlant[] = [];
  categoriesSelected: Number[] = [];

  constructor(private cs: CategoryService, private ps: PlantService) {}

  ngOnInit(): void {
    this.cs.all().subscribe(value => {
      this.categories = value;
      this.categoryTypes = [...new Set(this.categories.map(item => item.categoryType))];
    });

    this.ps.all().subscribe(value => {
      this.plants = value;
    });
  }

  onlyUnique(value: any, index: any, array: any) {
    return array.indexOf(value) === index;
  }

  checkCategory(cat: ICategory) {
    if (this.categoriesSelected.includes(cat.id)) {
      this.categoriesSelected.splice(this.categoriesSelected.indexOf(cat.id), 1);
    } else {
      this.categoriesSelected.push(cat.id);
    }
  }

  checkArrayIntersect(cats: Pick<ICategory, 'id'>[] | null | undefined): boolean {
    return (
      this.categoriesSelected.length == 0 ||
      (cats != null && cats.filter(value => this.categoriesSelected.includes(value.id)).length == this.categoriesSelected.length)
    );
  }
}
