import { Injectable } from '@angular/core';

export type FilterSort = 'no' | 'asc' | 'desc';

export interface Filtering {
  sortBy?: FilterSort;
  searchWord?: string;
  categoriesSelected?: number[];
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilteringPlantsService {
  filter: Filtering = {};

  getSaveFilter(): {sortBy: FilterSort, searchWord: string, categoriesSelected: number[], minPrice: number, maxPrice: number} {
    return {
      sortBy: (this.filter.sortBy !== undefined ? this.filter.sortBy : 'no'),
      searchWord: (this.filter.searchWord !== undefined ? this.filter.searchWord : ''),
      categoriesSelected: (this.filter.categoriesSelected !== undefined ? this.filter.categoriesSelected : []),
      minPrice: (this.filter.minPrice !== undefined ? this.filter.minPrice : 0),
      maxPrice: (this.filter.maxPrice !== undefined ? this.filter.maxPrice : -1)
    };
  }
  saveFilter(filter: Filtering): void {
    if (filter.sortBy) {
      this.filter.sortBy = filter.sortBy;
    }
    if (filter.searchWord) {
      this.filter.searchWord = filter.searchWord;
    }
    if (filter.categoriesSelected) {
      this.filter.categoriesSelected = filter.categoriesSelected;
    }
    if (filter.minPrice) {
      this.filter.minPrice = filter.minPrice;
    }
    if (filter.maxPrice) {
      this.filter.maxPrice = filter.maxPrice;
    }
  }

  resetFilter(): void {
    this.filter = {}
  }
}
