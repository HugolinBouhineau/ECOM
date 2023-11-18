import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommandItem } from '../command-item.model';
import { CommandItemService } from '../service/command-item.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './command-item-delete-dialog.component.html',
})
export class CommandItemDeleteDialogComponent {
  commandItem?: ICommandItem;

  constructor(protected commandItemService: CommandItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commandItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
