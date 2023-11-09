import { Component, OnInit } from '@angular/core';
import { Item, PanierService } from '../../panier.service';
import { IPlant } from '../../entities/plant/plant.model';
import { AlertService } from '../../core/util/alert.service';
import { Account } from '../../core/auth/account.model';
import { AccountService } from '../../core/auth/account.service';
import { Router } from '@angular/router';
import { StateStorageService } from '../../core/auth/state-storage.service';

@Component({
  selector: 'jhi-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  imgUrl: string = 'https://ecom1465.blob.core.windows.net/test/';
  account: Account | null = null;

  constructor(
    private ps: PanierService,
    private alertService: AlertService,
    private accountService: AccountService,
    private router: Router,
    private stateStorageService: StateStorageService
  ) {}

  ngOnInit(): void {
    this.ps.restore();
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
  }

  getTotal() {
    return this.ps.getTotal();
  }

  getItems() {
    return this.ps.getItems();
  }

  addItem(item: Item): void {
    this.ps.addToCart(item.plant);
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

  goToPayement() {
    if (this.account != null) {
      this.router.navigate(['/payment']);
    } else {
      this.stateStorageService.storeUrl('payment');
      this.router.navigate(['/login']);
    }
  }

  getImageUrl(item: Item): string {
    if (item && item.plant && item.plant.imagePath) {
      return item.plant.imagePath.split('**')[0];
    } else {
      return '';
    }
  }
}
