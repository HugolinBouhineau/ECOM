import { Component, OnInit } from '@angular/core';
import { CustomerComponent } from '../../entities/customer/list/customer.component';
import { AccountService } from '../../core/auth/account.service';
import { CustomerService } from '../../entities/customer/service/customer.service';
import { ICustomer } from '../../entities/customer/customer.model';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  authenticatedUser: Account | undefined;
  customer!: ICustomer;

  constructor(private accountService: AccountService, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe((user: Account | null) => {
      if (user != null) {
        this.authenticatedUser = user;
      } else {
        this.authenticatedUser = undefined;
      }
    });
  }

  submit() {}
}
