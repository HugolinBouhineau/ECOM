import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../entities/customer/service/customer.service';
import { ICustomer } from '../../entities/customer/customer.model';
import { IAddress, NewAddress } from '../../entities/address/address.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Item, PanierService } from '../../panier.service';
import { AddressService } from '../../entities/address/service/address.service';
import { NewCommand } from '../../entities/command/command.model';
import { CommandState } from '../../entities/enumerations/command-state.model';
import { IPlant } from '../../entities/plant/plant.model';
import dayjs from 'dayjs/esm';
import { CommandService } from '../../entities/command/service/command.service';

/* Compare year : if expiration Year > current Year => OK
                  if expiration Year = current Year => MAYBE (Check Month)
                  if expiration Year < current Year => NOK
*/
function compareYear(currentYear: string, expiredYear: string) {
  let diff: number = currentYear.localeCompare(expiredYear);
  if (diff < 0) {
    return 'OK';
  } else if (diff === 0) {
    return 'MAYBE';
  } else {
    return 'NOK';
  }
}

/* Compare month : if expiration Month > current Month => OK
                   if expiration Month = current Month => OK (Expire at the end of the month)
                   if expiration Month < current Month => NOK
*/
function compareMonth(currentMonth: string, expiredMonth: string) {
  if (currentMonth.localeCompare(expiredMonth) <= 0) {
    return 'OK';
  }
  return 'NOK';
}

function creditCardValidator(control: FormControl) {
  let currentDate: string[] = dayjs(new Date()).format('MM/YYYY').split('/');
  let expiredDate: string[] = control.value.replace(/\s/g, '').split('/');
  if (expiredDate.length === 2) {
    if (expiredDate[1].length === 2) {
      // Remove the first 2 digit
      currentDate[1] = currentDate[1].substring(2, 4);
    }
    if (expiredDate[1].length === 2 || expiredDate[1].length === 4) {
      switch (compareYear(currentDate[1], expiredDate[1])) {
        case 'OK':
          return null;
        case 'MAYBE':
          if (compareMonth(currentDate[0], expiredDate[0]) === 'OK') {
            return null;
          }
          break;
        case 'NOK':
          break;
      }
    }
  }
  return {
    expiredCard: {
      expiredDate: true,
    },
  };
}

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
  errorSaveAddress: boolean = false;
  errorCreateCommand: boolean = false;

  addressFound: boolean = false;
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
      validators: [Validators.required, Validators.pattern('^ *(0[1-9]|1[0-2]) */ *([0-9]{4}|[0-9]{2}) *$'), creditCardValidator],
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

  constructor(
    private customerService: CustomerService,
    private panierService: PanierService,
    private addressService: AddressService,
    private commandService: CommandService
  ) {
  }

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
        typeof selectedAddresse.zipCode === 'string' ? selectedAddresse.zipCode : '',
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

  getListPlants(): IPlant[] {
    let listPlants: IPlant[] = [];
    for (let item of this.getItems()) {
      listPlants.push(item.plant);
    }
    return listPlants;
  }

  sendNewAaddress(address: NewAddress): void {
    this.addressService.create(address).subscribe({
      next: addresse => {
        this.errorSaveAddress = false;
        this.sendNewCommand(addresse.body);
      },
      error: () => (this.errorSaveAddress = true),
    });
  }

  sendNewCommand(address: IAddress | null) {
    let newCommand: NewCommand = {
      address: address,
      customer: this.customer,
      id: null,
      plants: this.getListPlants(),
      purchaseDate: dayjs(new Date()),
      state: CommandState.InProgress,
    };
    this.commandService.create(newCommand).subscribe({
      next: () => {
        if (!this.errorCreateCommand && !this.errorSaveAddress) {
          this.panierService.clearCart();
          this.success = true;
        }
      },
      error: () => (this.errorCreateCommand = true),
    });
  }

  submit(): void {
    // Save the address
    const { city, street, zipCode, additionalInfo } = this.paymentForm.getRawValue();
    let newAddress: NewAddress = {
      additionalInfo: additionalInfo,
      city: city,
      customer: this.saveAddress ? this.customer : null,
      id: null,
      street: street,
      zipCode: zipCode.replace(/\s/g, ''),
    };
    if (this.addresses) {
      for (let address of this.addresses) {
        if (address.city === newAddress.city && address.zipCode === newAddress.zipCode && address.street === newAddress.street) {
          this.sendNewCommand(address);
          this.addressFound = true;
          break;
        }
      }
    }

    if (!this.addressFound) {
      this.sendNewAaddress(newAddress);
      return;
    }
  }
}
