import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommandFormService } from './command-form.service';
import { CommandService } from '../service/command.service';
import { ICommand } from '../command.model';
import { IPlants } from 'app/entities/plants/plants.model';
import { PlantsService } from 'app/entities/plants/service/plants.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { CommandUpdateComponent } from './command-update.component';

describe('Command Management Update Component', () => {
  let comp: CommandUpdateComponent;
  let fixture: ComponentFixture<CommandUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commandFormService: CommandFormService;
  let commandService: CommandService;
  let plantsService: PlantsService;
  let customerService: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommandUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CommandUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommandUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commandFormService = TestBed.inject(CommandFormService);
    commandService = TestBed.inject(CommandService);
    plantsService = TestBed.inject(PlantsService);
    customerService = TestBed.inject(CustomerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Plants query and add missing value', () => {
      const command: ICommand = { id: 456 };
      const plants: IPlants[] = [{ id: 92473 }];
      command.plants = plants;

      const plantsCollection: IPlants[] = [{ id: 42246 }];
      jest.spyOn(plantsService, 'query').mockReturnValue(of(new HttpResponse({ body: plantsCollection })));
      const additionalPlants = [...plants];
      const expectedCollection: IPlants[] = [...additionalPlants, ...plantsCollection];
      jest.spyOn(plantsService, 'addPlantsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ command });
      comp.ngOnInit();

      expect(plantsService.query).toHaveBeenCalled();
      expect(plantsService.addPlantsToCollectionIfMissing).toHaveBeenCalledWith(
        plantsCollection,
        ...additionalPlants.map(expect.objectContaining)
      );
      expect(comp.plantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Customer query and add missing value', () => {
      const command: ICommand = { id: 456 };
      const customer: ICustomer = { id: 11706 };
      command.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 5776 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ command });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(
        customerCollection,
        ...additionalCustomers.map(expect.objectContaining)
      );
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const command: ICommand = { id: 456 };
      const plants: IPlants = { id: 55030 };
      command.plants = [plants];
      const customer: ICustomer = { id: 74412 };
      command.customer = customer;

      activatedRoute.data = of({ command });
      comp.ngOnInit();

      expect(comp.plantsSharedCollection).toContain(plants);
      expect(comp.customersSharedCollection).toContain(customer);
      expect(comp.command).toEqual(command);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommand>>();
      const command = { id: 123 };
      jest.spyOn(commandFormService, 'getCommand').mockReturnValue(command);
      jest.spyOn(commandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ command });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: command }));
      saveSubject.complete();

      // THEN
      expect(commandFormService.getCommand).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(commandService.update).toHaveBeenCalledWith(expect.objectContaining(command));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommand>>();
      const command = { id: 123 };
      jest.spyOn(commandFormService, 'getCommand').mockReturnValue({ id: null });
      jest.spyOn(commandService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ command: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: command }));
      saveSubject.complete();

      // THEN
      expect(commandFormService.getCommand).toHaveBeenCalled();
      expect(commandService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommand>>();
      const command = { id: 123 };
      jest.spyOn(commandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ command });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commandService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePlants', () => {
      it('Should forward to plantsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(plantsService, 'comparePlants');
        comp.comparePlants(entity, entity2);
        expect(plantsService.comparePlants).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCustomer', () => {
      it('Should forward to customerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(customerService, 'compareCustomer');
        comp.compareCustomer(entity, entity2);
        expect(customerService.compareCustomer).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
