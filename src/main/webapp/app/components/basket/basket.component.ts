import { Component, OnInit } from '@angular/core';
import { Item, PanierService } from '../../panier.service';
import { IPlant } from '../../entities/plant/plant.model';

@Component({
  selector: 'jhi-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  items: Item[] = [];
  total: number = 0;

  constructor(private ps: PanierService) {}

  ngOnInit(): void {
    this.items = this.ps.getItems();
    this.total = this.ps.getTotal();
  }

  getTotal() {
    return this.ps.getTotal();
  }

  addItem(plant: IPlant): void {
    this.ps.addToCart(plant);
  }

  lessItem(plant: IPlant): void {
    this.ps.LessToCart(plant);
  }

  Clear(): void {
    this.ps.clearCart();
    window.location.reload();
  }

  removeItem(plant: IPlant): void {
    this.ps.removeItem(plant);
    window.location.reload();
  }
}
