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
  account: Account | null = null;
  public img_link:string = "";
  plants:IPlant[] = [];
  selected:IPlant|undefined = undefined;
  imgUrl: string = 'https://ecom1465.blob.core.windows.net/test/';
  constructor(private router: Router, private ps: PlantService,) {
  }

  ngOnInit(): void {
    this.ps.all().subscribe(value => {
      this.plants = value;
      let index:number = Math.floor(Math.random() * this.plants.length);
      this.selected = this.plants[index];
    })
  };

  getPath(): string {
    if (this.selected && this.selected.imagePath) {
      return this.imgUrl + this.selected.imagePath.split('**')[0];
    }
    return '';
  }

  getName():string{
    if (this.selected){
      return <string> this.selected.name;
    }
    return '';
  }
}
