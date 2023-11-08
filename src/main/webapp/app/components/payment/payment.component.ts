import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../entities/customer/service/customer.service';
import { ICustomer } from '../../entities/customer/customer.model';
import { IAddress } from '../../entities/address/address.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item, PanierService } from '../../panier.service';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  customer: ICustomer | null;
  addresses: IAddress[] | null | undefined;
  selectedAddrIndex: number;

  success: boolean = false;
  error: boolean = false;
  saveAddress: boolean = false;

  /*
    Modifier les regex des patterns pour ne pas prendre en compte les espaces et les tirets (num carte)
   */
  paymentForm = new FormGroup({
    street: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(254)],
    }),
    zipCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^ *[0-9]{2}( *|)[0-9]{3} *$')],
    }),
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    additionalInfo: new FormControl(''),
    numberCard: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^( *\\d){16} *$')],
    }),
    expirationCard: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^ *[0-9]{2} */ *[0-9]{2} *$')],
    }),
    secretCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^ *[0-9]{3} *$')],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
  });

  constructor(private customerService: CustomerService, private panierService: PanierService) {
    this.customer = null;
    this.addresses = null;
    this.selectedAddrIndex = -1;
  }

  ngOnInit(): void {
    this.customerService.getCurrentCustomer().subscribe(value => {
      this.customer = value;
      if (this.customer != null) {
        this.addresses = this.customer.addresses;
      }
    });
  }

  private patchValueAddresses(street: string, zipCode: string, city: string, additionalInfo: string) {
    this.paymentForm.patchValue({
      street: street,
      zipCode: zipCode,
      city: city,
      additionalInfo: additionalInfo,
    });
  }

  changeInputAddress(): void {
    if (this.addresses == null) {
      return;
    }

    if (this.selectedAddrIndex == -1) {
      this.patchValueAddresses('', '', '', '');
    } else {
      let selectedAddresse = this.addresses[this.selectedAddrIndex];
      console.log(this.selectedAddrIndex);
      this.patchValueAddresses(
        typeof selectedAddresse.street === 'string' ? selectedAddresse.street : '',
        typeof selectedAddresse.zipCode === 'number' ? selectedAddresse.zipCode.toString() : '',
        typeof selectedAddresse.city === 'string' ? selectedAddresse.city : '',
        typeof selectedAddresse.additionalInfo === 'string' ? selectedAddresse.additionalInfo : ''
      );
    }
  }

  getTotal(): number {
    return this.panierService.getTotal();
  }

  getItems(): Item[] {
    return this.panierService.getItems();
  }

  submit(): void {}
}
