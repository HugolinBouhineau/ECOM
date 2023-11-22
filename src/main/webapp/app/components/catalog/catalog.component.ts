import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../entities/category/service/category.service';
import { ICategory } from '../../entities/category/category.model';
import { PlantService } from '../../entities/plant/service/plant.service';
import { IPlant } from '../../entities/plant/plant.model';
import { PanierService } from '../../panier.service';

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
  searchWord: string = '';
  imgUrl: string = 'https://ecom1465.blob.core.windows.net/test/';

  constructor(private categoryService: CategoryService, private plantService: PlantService, private panierService: PanierService) {}

  ngOnInit(): void {
    this.categoryService.all().subscribe(value => {
      this.categories = value;
      this.categoryTypes = [...new Set(this.categories.map(item => item.categoryType))];
      this.categories.map(cat => {
        if (cat.categoryName) {
          cat.categoryName = cat.categoryName.charAt(0).toUpperCase() + cat.categoryName.slice(1).toLowerCase();
        }
      });
    });

    this.plantService.all().subscribe(value => {
      this.plants = value;
    });
  }

  onlyUnique(value: any, index: any, array: any) {
    return array.indexOf(value) === index;
  }

  filterPlantsFromCategory(cat: ICategory) {
    if (this.categoriesSelected.includes(cat.id)) {
      this.categoriesSelected.splice(this.categoriesSelected.indexOf(cat.id), 1);
    } else {
      this.categoriesSelected.push(cat.id);
    }
    this.plantService.filterPlant(this.searchWord, this.categoriesSelected).subscribe(value => {
      this.plants = value;
    });
  }

  checkArrayIntersect(cats: Pick<ICategory, 'id'>[] | null | undefined): boolean {
    return (
      this.categoriesSelected.length == 0 ||
      (cats != null && cats.filter(value => this.categoriesSelected.includes(value.id)).length == this.categoriesSelected.length)
    );
  }

  addToCart(plant: IPlant) {
    this.panierService.addToCart(plant);
  }

  sortByAscendingPrice() {
    this.plants.sort((a: IPlant, b: IPlant) => this.compare(a, b));
  }

  sortByDescendingPrice() {
    this.plants.sort((a: IPlant, b: IPlant) => this.compare(b, a));
  }

  compare(a: IPlant, b: IPlant) {
    if (a.price == null || b.price == null) {
      return 0;
    }
    if (a.price < b.price) {
      return -1;
    } else if (a.price > b.price) {
      return 1;
    }
    return 0;
  }

  getPath(a: IPlant): string {
    if (a.imagePath) {
      return this.imgUrl + a.imagePath.split('**')[0];
    }
    return '';
  }
}
