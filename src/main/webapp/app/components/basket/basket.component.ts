import { Component, OnInit } from '@angular/core';
import { Item, PanierService } from '../../panier.service';
import {IPlant} from '../../entities/plant/plant.model';
import { Account } from '../../core/auth/account.model';
import { AccountService } from '../../core/auth/account.service';
import {PlantService} from "../../entities/plant/service/plant.service";
import { AlertService} from "../../core/util/alert.service";
import {CommandDialogServiceService} from "../../command-dialog/command-dialog-service.service";

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
    private accountService: AccountService,
    private plantService: PlantService,
    private alertService: AlertService,
    private cds: CommandDialogServiceService
  ) {}

  ngOnInit(): void {
    this.ps.restore();
    this.updateStock();
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

  updateStock() : void {
    for (let item of this.ps.getItems()) {
      this.plantService.find(item.plant.id).subscribe(value => {
        if(value.body){
          let plant : IPlant = value.body;
          console.log(plant)
          if(plant && plant.stock!=undefined){
            // Remove item from basket in no longer in stock
            if(plant.stock<=0){
              this.ps.removeItem(plant);
              this.alertService.addAlert({ type: 'warning', message: "Un objet de votre panier n'est plus disponible dans la quantité souhaitée, veuillez vérifier les objets de votre panier" });
            }else{
              if(this.ps.setStock(plant.stock, plant)){
                this.alertService.addAlert({ type: 'warning', message: "Un objet de votre panier n'est plus disponible dans la quantité souhaitée, veuillez vérifier les objets de votre panier" });
              }
            }
          }
        }
      });
    }
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
