import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlant } from '../plant.model';

@Component({
  selector: 'jhi-plant-detail',
  templateUrl: './plant-detail.component.html',
})
export class PlantDetailComponent implements OnInit {
  plant: IPlant | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plant }) => {
      this.plant = plant;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
