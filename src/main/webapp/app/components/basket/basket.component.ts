import { Component, OnInit } from '@angular/core';
import { Item, PanierService } from '../../panier.service';
import { IPlant } from '../../entities/plant/plant.model';
import { AlertService } from '../../core/util/alert.service';
import { Account } from '../../core/auth/account.model';
import { AccountService } from '../../core/auth/account.service';
import { Router } from '@angular/router';
import { StateStorageService } from '../../core/auth/state-storage.service';
import {ITEM_DELETED_EVENT} from "../../config/navigation.constants";
import {CommandDialogServiceService} from "../../command-dialog/command-dialog-service.service";
import {ICommand} from "../../entities/command/command.model";

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
    private stateStorageService: StateStorageService,
    private cds: CommandDialogServiceService
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

  getImageUrl(item: Item): string {
    if (item && item.plant && item.plant.imagePath) {
      return item.plant.imagePath.split('**')[0];
    } else {
      return '';
    }
  }

  public openConfirmationDialog(): void {
    this.cds
      .confirm('Veuillez confirmer', 'Voulez-vous vraiment vider votre panier ?')
      .then((confirmed: boolean): void => {
        if (confirmed) {
          this.Clear();
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
