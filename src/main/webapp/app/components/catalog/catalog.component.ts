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
  totalPlants = 0;
  categoriesSelected: number[] = [];
  searchWord = '';
  imgUrl = 'https://ecom1465.blob.core.windows.net/test/';
  currentPage = 0;
  totalPage = 0;
  size = 6;
  sortby = 'no';
  isLastPage = false;
  isFirstPage = false;
  hasNoPlants = false;
  windowScrolled = false;
  error = false;

  constructor(private categoryService: CategoryService, private plantService: PlantService, private panierService: PanierService) {}

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });

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

  filterPlantsFromCategory(cat: ICategory): void {
    if (this.categoriesSelected.includes(cat.id)) {
      this.categoriesSelected.splice(this.categoriesSelected.indexOf(cat.id), 1);
    } else {
      this.categoriesSelected.push(cat.id);
    }
    this.filterPlant();
  }

  addToCart(plant: IPlant): void {
    this.panierService.addToCart(plant);
  }

  sortByAscendingPrice(): void {
    this.sortby = 'asc';
    this.filterPlant();
  }

  sortByDescendingPrice(): void {
    this.sortby = 'desc';
    this.filterPlant();
  }

  getPath(a: IPlant): string {
    if (a.imagePath) {
      return this.imgUrl + a.imagePath.split('**')[0];
    }
    return '';
  }

  newSearchWord(event: string): void {
    this.searchWord = event;
    this.filterPlant();
  }

  changeSizePlants(number: number): void {
    this.size = number;
    this.filterPlant();
  }

  filterPlant(useCurrentPage = false): void {
    this.plantService
      .filterPlant(useCurrentPage ? this.currentPage : 0, this.size, this.sortby, this.searchWord, this.categoriesSelected)
      .subscribe({
        next: body => {
          this.error = false;
          this.plants = body.content;
          this.totalPlants = body.totalElements;
          this.currentPage = body.pageable.pageNumber;
          this.totalPage = body.totalPages;
          this.hasNoPlants = false;
          this.isLastPage = false;
          this.isFirstPage = false;

          if (body.numberOfElements === 0) {
            this.hasNoPlants = true;
          }
          if (this.currentPage === this.totalPage - 1) {
            this.isLastPage = true;
          }
          if (this.currentPage === 0) {
            this.isFirstPage = true;
          }
        },
        error: () => {
          this.error = true;
        },
      });
  }

  upPage(): void {
    this.currentPage += 1;
    this.filterPlant(true);
  }

  downPage(): void {
    this.currentPage -= 1;
    this.filterPlant(true);
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}
