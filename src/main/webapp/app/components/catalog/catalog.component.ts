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
  totalPlants: number = 0;
  categoriesSelected: Number[] = [];
  searchWord: string = '';
  imgUrl: string = 'https://ecom1465.blob.core.windows.net/test/';
  currentPage: number = 0;
  totalPage: number = 0;
  size: number = 6;
  sortby: string = 'no';
  isLastPage: boolean = false;
  isFirstPage: boolean = false;
  isOutsidePage: boolean = false;
  hasNoPlants: boolean = false;
  windowScrolled: boolean = false;


  constructor(private categoryService: CategoryService, private plantService: PlantService, private panierService: PanierService) {}

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    })

    this.categoryService.all().subscribe(value => {
      this.categories = value;
      this.categoryTypes = [...new Set(this.categories.map(item => item.categoryType))];
      this.categories.map(cat => {
        if (cat.categoryName) {
          cat.categoryName = cat.categoryName.charAt(0).toUpperCase() + cat.categoryName.slice(1).toLowerCase();
        }
      });
    });
    this.filterPlant();
  }

  filterPlantsFromCategory(cat: ICategory) {
    if (this.categoriesSelected.includes(cat.id)) {
      this.categoriesSelected.splice(this.categoriesSelected.indexOf(cat.id), 1);
    } else {
      this.categoriesSelected.push(cat.id);
    }
    this.filterPlant();
  }


  addToCart(plant: IPlant) {
    this.panierService.addToCart(plant);
  }

  sortByAscendingPrice() {
    this.sortby = "asc";
    this.filterPlant();
  }

  sortByDescendingPrice() {
    this.sortby = "desc";
    this.filterPlant();
  }

  getPath(a: IPlant): string {
    if (a.imagePath) {
      return this.imgUrl + a.imagePath.split('**')[0];
    }
    return '';
  }

  newSearchWord(event: string) {
    this.searchWord = event;
    this.filterPlant();
  }

  changeSizePlants(number: number) {
    this.size = number;
    this.filterPlant();
  }

  filterPlant(useCurrentPage: boolean = false): void {
    this.plantService.filterPlant((useCurrentPage ? this.currentPage : 0), this.size, this.sortby, this.searchWord, this.categoriesSelected).subscribe(
      body => {
          this.plants = body.content;
          this.totalPlants = body.totalElements;
          this.currentPage = body.pageable.pageNumber;
          this.totalPage = body.totalPages;
          this.isOutsidePage = false;
          this.hasNoPlants = false;
          this.isLastPage = false;
          this.isFirstPage = false;

          if (body.numberOfElements === 0) {
            this.hasNoPlants = true;
          }
          if (this.currentPage >= this.totalPage) {
            this.isOutsidePage = true;
          }
          if (this.currentPage === this.totalPage - 1) {
            this.isLastPage = true;
          }
          if (this.currentPage === 0) {
            this.isFirstPage = true;
          }
      }
    );
  }

  upPage() {
      this.currentPage += 1;
      this.filterPlant(true);
  }

  downPage() {
      this.currentPage -= 1;
      this.filterPlant(true);
  }

    scrollToTop() {
      window.scrollTo(0, 0);
    }
}
