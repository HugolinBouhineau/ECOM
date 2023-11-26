import { Component, OnInit } from '@angular/core';
import { PlantService } from '../../entities/plant/service/plant.service';
import { ActivatedRoute, Params } from '@angular/router';
import { IPlant } from '../../entities/plant/plant.model';
import { PanierService } from '../../panier.service';
import { AlertService } from '../../core/util/alert.service';

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
  constructor(
    private ps: PlantService,
    private activatedRoute: ActivatedRoute,
    private paniers: PanierService,
    private alertService: AlertService
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
    });
  }
}
