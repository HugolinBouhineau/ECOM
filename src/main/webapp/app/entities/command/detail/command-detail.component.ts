import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommand } from '../command.model';

@Component({
  selector: 'jhi-command-detail',
  templateUrl: './command-detail.component.html',
})
export class CommandDetailComponent implements OnInit {
  command: ICommand | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ command }) => {
      this.command = command;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
