import { Component, OnInit } from '@angular/core';
import { Item, PanierService } from '../../panier.service';
import { IPlant } from '../../entities/plant/plant.model';
import { AlertService } from '../../core/util/alert.service';

@Component({
  selector: 'jhi-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  imgUrl: string = 'https://ecom1465.blob.core.windows.net/test/';

  constructor(private ps: PanierService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.ps.restore();
  }

  getTotal() {
    return this.ps.getTotal();
  }

  getItems() {
    return this.ps.getItems();
  }

  addItem(item: Item): void {
    if (item.plant.stock && item.plant.stock > item.get_quantity()) {
      this.ps.addToCart(item.plant);
    } else {
      this.alertService.addAlert({ type: 'danger', message: "L'item n'a pas pû être ajoutée" });
    }
  }

  lessItem(plant: IPlant): void {
    this.ps.LessToCart(plant);
  }

  Clear(): void {
    this.ps.clearCart();
  }

  removeItem(plant: IPlant): void {
    this.ps.removeItem(plant);
  }
}
