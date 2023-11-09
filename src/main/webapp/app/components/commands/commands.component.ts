import {Component, OnInit} from '@angular/core';
import {ICommand} from "../../entities/command/command.model";
import {Account} from "../../core/auth/account.model";
import {AccountService} from "../../core/auth/account.service";
import {CustomerService} from "../../entities/customer/service/customer.service";
import {ICustomer} from "../../entities/customer/customer.model";
import {CommandService} from "../../entities/command/service/command.service";
import {CommandState} from "../../entities/enumerations/command-state.model";
import dayjs from "dayjs/esm";
import {IPlant} from "../../entities/plant/plant.model";
import {CommandDialogServiceService} from "../../command-dialog/command-dialog-service.service";

@Component({
  selector: 'jhi-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss'],
})

export class CommandsComponent implements OnInit {
  list_command_passed: ICommand[]= [];
  progress_command: ICommand[] = [];
  id:number = 0;
  authenticatedUser: Account|undefined = undefined;
  customer: ICustomer|undefined = undefined;

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private commandService: CommandService,
    private cds:CommandDialogServiceService
    ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe((user: Account | null) => {
      if (user != null) {
        this.authenticatedUser = user;
      } else {
        this.authenticatedUser = undefined;
      }
    });
    this.customerService.getCurrentCustomer().subscribe(
      (customer: ICustomer | undefined) => {
        this.customer = customer;
        if (customer){
          this.id = customer.id;
        }
      }
    );
    this.load();
  }

  load():void{
    this.list_command_passed = [];
    this.progress_command = [];
    this.commandService.all().subscribe(
      (commandz:ICommand[]) => {
        this.parce(commandz);
      });

    this.list_command_passed.sort((a:ICommand,b:ICommand) => {
        let date_a:dayjs.Dayjs = <dayjs.Dayjs> a.purchaseDate;
        return date_a.diff(b.purchaseDate);
      }
    );

    this.progress_command.sort((a:ICommand,b:ICommand) => {
        let date_a:dayjs.Dayjs = <dayjs.Dayjs> a.purchaseDate;
        return date_a.diff(b.purchaseDate);
      }
    );
  }

  parce(commandz:ICommand[]){
    for(let i = 0;i < commandz.length; i++){
      let customer:ICustomer = <ICustomer> commandz[i].customer;
      if (customer.id == this.id){
        if (commandz[i].state == CommandState.InProgress){this.progress_command.push(commandz[i]);}
        else {this.list_command_passed.push(commandz[i]);}
      }
    }
  }
  getPrice(command:ICommand):number{
    let total:number = 0;
    let plant:Pick<IPlant, 'id' | 'price'>;
    for(let i:number = 0; i< <number> command.plants?.length; i++){
      // @ts-ignore
      plant = command.plants[i];
      total = total + <number> plant.price;
    }
    return total;
  }

  public openConfirmationDialog(command:ICommand):void {
    this.cds.confirm('Veuillez confirmer', 'Voulez-vous vraiment annuler cette commande ?')
      .then((confirmed : boolean) : void => {
        if (confirmed){
          this.Cancel(command);}
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  Cancel(command:ICommand):void{
    command.state =  CommandState.Cancelled;
    command.purchaseDate = dayjs(command.purchaseDate);
    this.commandService.update(command).subscribe((body:any) => {this.load();})

  }

  protected readonly CommandState = CommandState;
}
