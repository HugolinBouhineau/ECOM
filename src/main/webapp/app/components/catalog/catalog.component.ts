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
  page: number = 0;
  size: number = 10;
  sortby: string = 'no';


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

    this.plantService.filterPlant(this.page, this.size, this.sortby, this.searchWord, this.categoriesSelected).subscribe(
      body => {
        this.plants = body.content;
      }
    )
  }

  filterPlantsFromCategory(cat: ICategory) {
    if (this.categoriesSelected.includes(cat.id)) {
      this.categoriesSelected.splice(this.categoriesSelected.indexOf(cat.id), 1);
    } else {
      this.categoriesSelected.push(cat.id);
    }
    this.plantService.filterPlant(this.page, this.size, this.sortby, this.searchWord, this.categoriesSelected).subscribe(
      value => {
        this.plants = value.content;
      }
    )
  }


  addToCart(plant: IPlant) {
    this.panierService.addToCart(plant);
  }

  sortByAscendingPrice() {
    this.sortby = "asc";
    this.plantService.filterPlant(this.page, this.size, this.sortby, this.searchWord, this.categoriesSelected).subscribe(
      value => {
        this.plants = value.content;
      }
    );
  }

  sortByDescendingPrice() {
    this.sortby = "desc";
    this.plantService.filterPlant(this.page, this.size, this.sortby, this.searchWord, this.categoriesSelected).subscribe(
      value => {
        this.plants = value.content;
      }
    );
  }

  getPath(a: IPlant): string {
    if (a.imagePath) {
      return this.imgUrl + a.imagePath.split('**')[0];
    }
    return '';
  }

  newSearchWord(event: string) {
    this.searchWord = event;
    this.plantService.filterPlant(this.page, this.size, this.sortby, this.searchWord, this.categoriesSelected).subscribe(
      value => {
        this.plants = value.content;
      }
    )
  }
}
