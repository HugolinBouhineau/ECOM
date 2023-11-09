import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../entities/customer/service/customer.service';
import { ICustomer } from '../../entities/customer/customer.model';
import {IAddress, NewAddress} from '../../entities/address/address.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item, PanierService } from '../../panier.service';
import { AddressService } from '../../entities/address/service/address.service';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  customer: ICustomer | null = null;
  addresses: IAddress[] | null = null;
  selectedAddrIndex: number = -1;

  success: boolean = false;
  error: boolean = false;
  errorAddressAlreadySave: boolean = false;

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

  constructor(private customerService: CustomerService, private panierService: PanierService, private addressService: AddressService) {}

  ngOnInit(): void {
    this.customerService.getCustomer().subscribe(customer => {
      this.customer = customer;
      if (this.customer && this.customer.addresses) {
        this.addresses = this.customer.addresses;
      } else {
        this.addresses = null;
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

  private zipCodeToNumber(oldZipCode: string): number | null {
    oldZipCode = oldZipCode.replace(/\s/g, "");
    return parseInt(oldZipCode);
  }

  submit(): void {
    // Save the address
    const { city, street, zipCode, additionalInfo } = this.paymentForm.getRawValue();
    let newAddress: NewAddress = {
      additionalInfo: additionalInfo,
      city: city,
      customer: this.customer,
      id: null,
      street: street,
      zipCode: this.zipCodeToNumber(zipCode)
    };
    if (this.saveAddress) {
      if (this.selectedAddrIndex != -1) {
        if (this.addresses) {
          let selectedAddress = this.addresses[this.selectedAddrIndex];
          if (newAddress.city != selectedAddress.city ||
              newAddress.street != selectedAddress.street ||
              newAddress.zipCode != selectedAddress.zipCode ||
              newAddress.additionalInfo != selectedAddress.additionalInfo
          ) {
            this.addressService.create(newAddress);
          } // else nothing
        } else {
          this.addressService.create(newAddress);
        }
      } else {
        this.addressService.create(newAddress);
      }
    }
  }
}

