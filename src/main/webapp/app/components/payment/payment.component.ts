import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../entities/customer/service/customer.service';
import { ICustomer } from '../../entities/customer/customer.model';
import {IAddress} from "../../entities/address/address.model";
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  customer: ICustomer | null;
  addresses: IAddress[] | null | undefined;
  selectedAddrIndex: number;
  inputAddr: string;
  inputCity: string;
  inputZipcode: string;
  inputAddInfo: string;

  constructor(
    private customerService: CustomerService,
  ) {
    this.customer = null;
    this.addresses = null;
    this.selectedAddrIndex = -1;
    this.inputAddr = "";
    this.inputCity = "";
    this.inputZipcode = "";
    this.inputAddInfo = "";
  }

  ngOnInit(): void {
    this.customerService.getCurrentCustomer().subscribe(
      value => {
        this.customer = value;
        if (this.customer != null) {
          this.addresses = this.customer.addresses;
        }
      }
    )
  }

  submit() {}

  test() {
    if (this.addresses == null) {
      return;
    }
    if (this.selectedAddrIndex == -1) {
      this.clearAddressInput();
    } else {
      let selectedAddr = this.addresses[this.selectedAddrIndex];
      this.inputAddr = (typeof selectedAddr.street === "string" ? selectedAddr.street : "");
      this.inputZipcode = (typeof selectedAddr.zipCode === "number" ? selectedAddr.zipCode.toString() : "");
      this.inputCity = (typeof selectedAddr.city === "string" ? selectedAddr.city : "");
      this.inputAddInfo = (typeof selectedAddr.additionalInfo === "string" ? selectedAddr.additionalInfo : "");
    }
  }

  clearAddressInput(): void {
    this.inputAddr = "";
    this.inputCity = "";
    this.inputZipcode = "";
    this.inputAddInfo = "";
  }
}
