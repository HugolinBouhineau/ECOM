import { Injectable } from '@angular/core';
import {IPlant} from "./entities/plant/plant.model";

export class Item{
    quantity:number = 1;

    constructor(public plant:IPlant){}

    public add_item():void{
      this.quantity++;
    }

    public remove_item():void{
      this.quantity--;
    }

    public get_quantity(): number{
      return this.quantity;
    }

    public get_price():number{
      return this.quantity * <number>this.plant.price;
    }
}

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  items:Item[] = [];
  total:number = 0;
  list_nom:string[] = [];
  constructor() {}

  addToCart(plant:IPlant):void{
    if (this.list_nom.includes(<string>plant.name)){
      this.items[this.list_nom.indexOf(<string>plant.name)].add_item();
    }
    else {this.items.push(new Item(plant));this.list_nom.push(<string>plant.name);}
    this.total = this.total + <number>plant.price;
  }

  getItems():Item[]{
    return this.items;
  }

  LessToCart(plant:IPlant):void{
    let item:Item = this.items[this.list_nom.indexOf(<string>plant.name)];
    if (item.get_quantity() > 1){item.remove_item();this.total = this.total - <number>plant.price;}
  }

  clearCart():Item[]{
    this.items = [];
    this.total = 0;
    return this.items;
  }

  getTotal():number{
    return this.total;
  }

  removeItem(plant:IPlant):void{
    let index:number = this.list_nom.indexOf(<string> plant.name);
    this.total = this.total - this.items[index].quantity * <number>plant.price;
    delete this.items[index];
  }
}
