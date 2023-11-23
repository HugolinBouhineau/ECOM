import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import {PlantService} from "../entities/plant/service/plant.service";
import {IPlant} from "../entities/plant/plant.model";

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  };
}
