import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../entities/category/service/category.service';
import { ICategory } from '../../entities/category/category.model';
import { PlantService } from '../../entities/plant/service/plant.service';
import { IPlant } from '../../entities/plant/plant.model';
import { PanierService } from '../../service/panier.service';
import { CommandItemService } from '../../entities/command-item/service/command-item.service';
import {FilteringPlantsService, FilterSort} from "../../service/filtering-plants.service";

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
  totalPlants = 0;
  categoriesSelected: number[] = [];
  searchWord = '';
  imgUrl = 'https://ecom1465.blob.core.windows.net/test/';
  currentPage = 0;
  totalPage = 0;
  size = 6;
  sortby: FilterSort = 'no';
  minPrice = 0;
  maxPrice = 0;
  maxRange = 0;
  isLastPage = false;
  isFirstPage = false;
  hasNoPlants = false;
  windowScrolled = false;
  error = false;
  leftSlide = 0;
  rightSlide = 0;

  constructor(
    private cs: CategoryService,
    private ps: PlantService,
    private panierService: PanierService,
    private cis: CommandItemService,
    private filteringPlantsService: FilteringPlantsService,
  ) {}

  ngOnInit(): void {
    // Event
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });

    this.cs.all().subscribe(value => {
      this.categories = value;
      this.categoryTypes = [...new Set(this.categories.map(item => item.categoryType))];
      this.categories.map(cat => {
        if (cat.categoryName) {
          cat.categoryName = cat.categoryName.charAt(0).toUpperCase() + cat.categoryName.slice(1).toLowerCase();
        }
      });
    });
    this.cis.getBestSeller().subscribe(best_seller => {
      this.best_sellers = best_seller;
    });

    this.ps.getMaxPrice().subscribe(value => {
      this.maxRange = value;

      // Get the filter
      const oldFilter = this.filteringPlantsService.getSaveFilter();
      this.sortby = oldFilter.sortBy;
      this.searchWord = oldFilter.searchWord;
      this.categoriesSelected = oldFilter.categoriesSelected;
      this.minPrice = oldFilter.minPrice;
      this.maxPrice = (oldFilter.maxPrice === -1 ? this.maxRange : oldFilter.maxPrice);
      this.changeLeftAndRightSlide()
      this.filterPlants();
    });
  }

  filterPlantsFromCategory(cat: ICategory): void {
    if (this.categoriesSelected.includes(cat.id)) {
      this.categoriesSelected.splice(this.categoriesSelected.indexOf(cat.id), 1);
    } else {
      this.categoriesSelected.push(cat.id);
    }
    this.filteringPlantsService.saveFilter({categoriesSelected: this.categoriesSelected});
    this.filterPlants();
  }

  addToCart(plant: IPlant): void {
    this.panierService.addToCart(plant);
  }

  sortByAscendingPrice(): void {
    this.sortby = 'asc';
    this.filteringPlantsService.saveFilter({sortBy: this.sortby});
    this.filterPlants();
  }

  sortByDescendingPrice(): void {
    this.sortby = 'desc';
    this.filteringPlantsService.saveFilter({sortBy: this.sortby});
    this.filterPlants();
  }

  getPath(a: IPlant): string {
    if (a.imagePath) {
      return this.imgUrl + a.imagePath.split('**')[0];
    }
    return '';
  }

  newSearchWord(event: string): void {
    this.searchWord = event;
    this.filteringPlantsService.saveFilter({searchWord: this.searchWord});
    this.filterPlants();
  }

  changeSizePlants(number: number): void {
    this.size = number;
    this.filterPlants();
  }

  filterPlants(useCurrentPage = false): void {
    this.ps
      .filterPlantWithPrice(
        useCurrentPage ? this.currentPage : 0,
        this.size,
        this.sortby,
        this.searchWord,
        this.categoriesSelected,
        this.minPrice,
        this.maxPrice
      )
      .subscribe({
        next: (body: any) => {
          this.error = false;
          this.plants = body.content;
          this.totalPlants = body.totalElements;
          this.currentPage = body.pageable.pageNumber;
          this.totalPage = (body.totalPages === 0 ? 1 : body.totalPages);
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
    this.filterPlants(true);
  }

  downPage(): void {
    this.currentPage -= 1;
    this.filterPlants(true);
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  GetBestSellPath(): string {
    return this.imgUrl + 'bestsell.png';
  }

  best_sell(a: IPlant): boolean {
    let verif = false;
    this.best_sellers.forEach(item => {
      if (a.id === item.id) {
        verif = true;
      }
    });
    return verif;
  }

  controlFromSliderChange(event: any): void {
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice;
      event.target.value = this.minPrice;
    }
    this.leftSlide = (this.minPrice * 100) / this.maxRange;
    this.filteringPlantsService.saveFilter({minPrice: this.minPrice});
    this.filterPlants();
  }

  controlToSliderChange(event: any): void {
    if (this.minPrice > this.maxPrice) {
      this.maxPrice = this.minPrice;
      event.target.value = this.maxPrice;
    }
    this.rightSlide = ((this.maxRange - this.maxPrice) * 100) / this.maxRange;
    this.filteringPlantsService.saveFilter({maxPrice: this.maxPrice});
    this.filterPlants();
  }

  controlFromSlider(event: any): void {
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice;
      event.target.value = this.minPrice;
    }
    this.leftSlide = (this.minPrice * 100) / this.maxRange;
  }

  controlToSlider(event: any): void {
    if (this.minPrice > this.maxPrice) {
      this.maxPrice = this.minPrice;
      event.target.value = this.maxPrice;
    }
    this.rightSlide = ((this.maxRange - this.maxPrice) * 100) / this.maxRange;
  }

  resetFilter(): void {
    this.filteringPlantsService.resetFilter();
    this.sortby = 'no';
    this.searchWord = '';
    this.categoriesSelected = [];
    this.minPrice = 0;
    this.maxPrice = this.maxRange;
    this.changeLeftAndRightSlide()
    this.filterPlants();
  }

  changeLeftAndRightSlide(): void {
    this.leftSlide = (this.minPrice * 100) / this.maxRange;
    this.rightSlide = ((this.maxRange - this.maxPrice) * 100) / this.maxRange;
  }
}
