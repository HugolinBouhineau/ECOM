import { Injectable } from '@angular/core';
import { IPlant } from './entities/plant/plant.model';
import { AlertService } from './core/util/alert.service';

export class Item implements ItemInterface {
  quantity: number;
  plant: IPlant;

  constructor(private init: ItemInterface) {
    this.quantity = init.quantity;
    this.plant = init.plant;
  }

  public add_item(): void {
    this.quantity++;
  }

  public remove_item(): void {
    this.quantity--;
  }

  public get_quantity(): number {
    return this.quantity;
  }

  public get_price(): number {
    return this.quantity * <number>this.plant.price;
  }
}

export interface ItemInterface {
  quantity: number;
  plant: IPlant;
}

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  items: Item[] = [];
  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.restore();
  }

  addToCart(plant: IPlant): void {
    let item = this.items.find(value => value.plant.latinName === plant.latinName);
    if (item) {
      if (item.plant.stock && item.plant.stock > item.get_quantity()) {
        item.add_item();
        this.alertService.addAlert({ type: 'success', message: "L'item a bien été ajouté au panier" });
      } else {
        this.alertService.addAlert({ type: 'danger', message: "L'item n'a pas pû être ajoutée" });
      }
    } else {
      this.items.push(new Item({ quantity: 1, plant: plant }));
      this.alertService.addAlert({ type: 'success', message: "L'item a bien été ajouté au panier" });
    }
    this.save();
  }

  getItems(): Item[] {
    return this.items;
  }

  LessToCart(plant: IPlant): void {
    let item = this.items.find(value => value.plant === plant);
    if (item && item.get_quantity() > 1) {
      item.remove_item();
    }

    this.save();
  }

  clearCart(): Item[] {
    this.items = [];
    this.save();
    return this.items;
  }

  getTotal(): number {
    let total: number = 0;
    for (let item of this.items) {
      total += item.get_price();
    }
    return total;
  }

  removeItem(plant: IPlant): void {
    this.items = this.items.filter(value => value.plant !== plant);
    this.save();
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  restore() {
    let value = localStorage.getItem('cart');
    if (value != '' && value != null && typeof value != 'undefined') {
      let results = JSON.parse(value!);
      this.items = [];
      for (let result of results) {
        this.items.push(new Item(result));
      }
      console.log(results);
      console.log(this.items);
    }
  }
}
