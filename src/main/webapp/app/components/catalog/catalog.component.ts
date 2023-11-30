import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../entities/category/service/category.service';
import { ICategory } from '../../entities/category/category.model';
import { PlantService } from '../../entities/plant/service/plant.service';
import { IPlant } from '../../entities/plant/plant.model';
import { Router } from '@angular/router';
import { PanierService } from '../../panier.service';
import { AlertService } from '../../core/util/alert.service';
import {CommandItemService} from "../../entities/command-item/service/command-item.service";

@Component({
  selector: 'jhi-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  categories: ICategory[] = [];
  categoryTypes: (number | null | undefined)[] = [];
  plants: IPlant[] = [];
  best_sellers: IPlant[] = [];
  categoriesSelected: Number[] = [];
  searchWord: string = '';
  imgUrl: string = 'https://ecom1465.blob.core.windows.net/test/';

  constructor(
    private cs: CategoryService,
    private ps: PlantService,
    private router: Router,
    private panierService: PanierService,
    private alertService: AlertService,
    private cis:CommandItemService
  ) {}

  ngOnInit(): void {
    this.cs.all().subscribe(value => {
      this.categories = value;
      this.categoryTypes = [...new Set(this.categories.map(item => item.categoryType))];
      this.categories.map(cat => {
        if (cat.categoryName) {
          cat.categoryName = cat.categoryName.charAt(0).toUpperCase() + cat.categoryName.slice(1).toLowerCase();
        }
      });
    });

    this.ps.all().subscribe(value => {
      this.plants = value;
      this.cis.getBestSeller().subscribe(best_seller => {
          this.best_sellers = best_seller;})
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

  GetBestSellPath():string{
    return this.imgUrl + "bestsell.png";
  }

  best_sell(a:IPlant):boolean{
    let verif:boolean = false;
    this.best_sellers.forEach(item => {
      if(a.id == item.id){verif = true;
      }
    })
    return verif;
  }
}
