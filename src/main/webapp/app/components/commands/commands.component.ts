import { Component, OnInit } from '@angular/core';
import { ICommand } from '../../entities/command/command.model';
import { Account } from '../../core/auth/account.model';
import { AccountService } from '../../core/auth/account.service';
import { CustomerService } from '../../entities/customer/service/customer.service';
import { ICustomer } from '../../entities/customer/customer.model';
import { CommandService } from '../../entities/command/service/command.service';
import { CommandState } from '../../entities/enumerations/command-state.model';
import dayjs from 'dayjs/esm';
import {IPlant} from '../../entities/plant/plant.model';
import { CommandDialogServiceService } from '../../command-dialog/command-dialog-service.service';
import { ICommandItem } from '../../entities/command-item/command-item.model';
import {PlantService} from "../../entities/plant/service/plant.service";
import {CommandItemService} from "../../entities/command-item/service/command-item.service";

@Component({
  selector: 'jhi-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss'],
})
export class CommandsComponent implements OnInit {
  list_command_passed: ICommand[] = [];
  progress_command: ICommand[] = [];
  id = 0;
  authenticatedUser: Account | undefined = undefined;
  customer: ICustomer | undefined = undefined;
  commandExpanded : boolean[] = [];

  protected readonly CommandState = CommandState;

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private commandService: CommandService,
    private commandItemService: CommandItemService,
    private cds: CommandDialogServiceService,
    private ps: PlantService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe((user: Account | null) => {
      if (user != null) {
        this.authenticatedUser = user;
      } else {
        this.authenticatedUser = undefined;
      }
    });
    this.customerService.getCustomer().subscribe((customer: ICustomer | undefined) => {
      this.customer = customer;
      if (customer) {
        this.id = customer.id;
        this.load();
      }
    });
  }

  load(): void {
    this.list_command_passed = [];
    this.progress_command = [];
    this.commandService.getCommandsByCustomerId(this.id).subscribe((commandz: ICommand[]) => {
      this.parce(commandz);

      // TODO : fix ce truc ça ne marche pas
      // this.list_command_passed.sort((a: ICommand, b: ICommand) => {
      //   const date_a: dayjs.Dayjs = <dayjs.Dayjs>a.purchaseDate;
      //   return date_a.diff(b.purchaseDate);
      // });
      //
      // this.progress_command.sort((a: ICommand, b: ICommand) => {
      //   const date_a: dayjs.Dayjs = <dayjs.Dayjs>a.purchaseDate;
      //   return date_a.diff(b.purchaseDate);
      // });
    });
  }

  parce(commandz: ICommand[]): void {
    for (let i = 0; i < commandz.length; i++) {
      // Add command items to command
      commandz[i].commandItems?.forEach(item => {
        this.commandItemService.find(item.id).subscribe(value => {
          item.plant = value.body?.plant;
        })
      })
      if (commandz[i].state === CommandState.InProgress || commandz[i].state === CommandState.Shipping) {
        this.progress_command.push(commandz[i]);
      } else {
        this.list_command_passed.push(commandz[i]);
      }
      this.commandExpanded[commandz[i].id] = false;
    }
  }

  getPrice(command: ICommand): number {
    let total = 0;
    if (command.commandItems) {
      const items: ICommandItem[] = command.commandItems;
      for (const item of items) {
        if (item.plant) {
          const plant: IPlant = item.plant;
          if (plant.price && item.quantity) {
            total += plant.price * item.quantity;
          }
        }
      }
    }
    return total;
  }

  public openConfirmationDialog(command: ICommand): void {
    this.cds.confirm('Veuillez confirmer', 'Voulez-vous vraiment annuler cette commande ?').then((confirmed: boolean): void => {
      if (confirmed) {
        this.Cancel(command);
      }
    });
  }

  Cancel(command: ICommand): void {
    command.state = CommandState.Cancelled;
    command.purchaseDate = dayjs(command.purchaseDate);
    this.commandService.update(command).subscribe(() => {
      this.ps.refillPlant(command.id).subscribe( () => {this.load();})
    });
  }
}
