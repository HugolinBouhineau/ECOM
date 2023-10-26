import { Component, OnInit } from '@angular/core';
import { CustomerComponent } from '../../entities/customer/list/customer.component';
import { AccountService } from '../../core/auth/account.service';
import { CustomerService } from '../../entities/customer/service/customer.service';
import { ICustomer } from '../../entities/customer/customer.model';
import { Account } from 'app/core/auth/account.model';
import {AddressService} from "../../entities/address/service/address.service";
import {IAddress} from "../../entities/address/address.model";

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  authenticatedUser: Account | undefined;
  customer: ICustomer | undefined;
  addresses: IAddress[] | undefined;

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe((user: Account | null) => {
      if (user != null) {
        this.authenticatedUser = user;
      } else {
        this.authenticatedUser = undefined;
      }
    });
    this.customerService.getCurrentCustomer().subscribe((customer: ICustomer | undefined) => {
      this.customer = customer
    });
    if (this.customer != undefined) {
      this.addressService.findByCustomerId(this.customer.id).subscribe((addresses: IAddress[] | null) => {
        if (addresses != null) {
          this.addresses = addresses;
        } else {
          this.addresses = undefined;
        }
      })
    }
  }

  submit() {}
}
