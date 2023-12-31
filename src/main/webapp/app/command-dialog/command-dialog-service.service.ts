import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommandDialogComponent } from './command-dialog.component';

@Injectable({ providedIn: 'root' })
export class CommandDialogServiceService {
  constructor(private modalService: NgbModal) {}

  public confirm(
    title: string,
    message: string,
    btnOkText = 'OK',
    btnCancelText = 'Annuler',
    dialogSize: 'sm' | 'lg' = 'sm'
  ): Promise<any> {
    const modalRef = this.modalService.open(CommandDialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }
}
