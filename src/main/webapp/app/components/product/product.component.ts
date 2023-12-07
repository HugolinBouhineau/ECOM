import { Component, OnInit } from '@angular/core';
import { PlantService } from '../../entities/plant/service/plant.service';
import { ActivatedRoute, Params } from '@angular/router';
import { IPlant } from '../../entities/plant/plant.model';
import { PanierService } from '../../service/panier.service';
import { AlertService } from '../../core/util/alert.service';
import { CommandItemService } from '../../entities/command-item/service/command-item.service';

@Component({
  selector: 'jhi-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  plant: any;
  href = '';
  stock = 0;
  plantID = 0;
  imagePath: string[] = [];
  path = 'https://ecom1465.blob.core.windows.net/test/';
  best_sellers: IPlant[] = [];
  constructor(
    private ps: PlantService,
    private activatedRoute: ActivatedRoute,
    private paniers: PanierService,
    private alertService: AlertService,
    private cis: CommandItemService
  ) {}

  public AddToCart(): void {
    this.paniers.addToCart(<IPlant>this.plant);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.plantID = params['PlantId'];
    });

    this.ps.find(this.plantID).subscribe(plant => {
      this.plant = plant.body;
      this.stock = this.plant.stock;
      this.imagePath = this.plant.imagePath.split('**');
      this.cis.getBestSeller().subscribe(best_seller => {
        this.best_sellers = best_seller;
      });
    });
  }

  GetBestSellerPath(): string {
    return this.path + 'bestsell.png';
  }

  best_sell(): boolean {
    let verif = false;
    this.best_sellers.forEach(item => {
      if (item.id === this.plant.id) {
        verif = true;
      }
    });
    return verif;
  }
}
