import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommandItem } from '../command-item.model';

@Component({
  selector: 'jhi-command-item-detail',
  templateUrl: './command-item-detail.component.html',
})
export class CommandItemDetailComponent implements OnInit {
  commandItem: ICommandItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commandItem }) => {
      this.commandItem = commandItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
