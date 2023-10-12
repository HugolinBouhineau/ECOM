import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlants } from '../plants.model';

@Component({
  selector: 'jhi-plants-detail',
  templateUrl: './plants-detail.component.html',
})
export class PlantsDetailComponent implements OnInit {
  plants: IPlants | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plants }) => {
      this.plants = plants;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
