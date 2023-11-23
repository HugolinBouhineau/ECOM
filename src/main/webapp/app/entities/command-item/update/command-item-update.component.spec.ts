import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommandItemFormService } from './command-item-form.service';
import { CommandItemService } from '../service/command-item.service';
import { ICommandItem } from '../command-item.model';
import { ICommand } from 'app/entities/command/command.model';
import { CommandService } from 'app/entities/command/service/command.service';
import { IPlant } from 'app/entities/plant/plant.model';
import { PlantService } from 'app/entities/plant/service/plant.service';

import { CommandItemUpdateComponent } from './command-item-update.component';

describe('CommandItem Management Update Component', () => {
  let comp: CommandItemUpdateComponent;
  let fixture: ComponentFixture<CommandItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commandItemFormService: CommandItemFormService;
  let commandItemService: CommandItemService;
  let commandService: CommandService;
  let plantService: PlantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommandItemUpdateComponent],
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
      .overrideTemplate(CommandItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommandItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commandItemFormService = TestBed.inject(CommandItemFormService);
    commandItemService = TestBed.inject(CommandItemService);
    commandService = TestBed.inject(CommandService);
    plantService = TestBed.inject(PlantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Command query and add missing value', () => {
      const commandItem: ICommandItem = { id: 456 };
      const command: ICommand = { id: 856 };
      commandItem.command = command;

      const commandCollection: ICommand[] = [{ id: 43605 }];
      jest.spyOn(commandService, 'query').mockReturnValue(of(new HttpResponse({ body: commandCollection })));
      const additionalCommands = [command];
      const expectedCollection: ICommand[] = [...additionalCommands, ...commandCollection];
      jest.spyOn(commandService, 'addCommandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commandItem });
      comp.ngOnInit();

      expect(commandService.query).toHaveBeenCalled();
      expect(commandService.addCommandToCollectionIfMissing).toHaveBeenCalledWith(
        commandCollection,
        ...additionalCommands.map(expect.objectContaining)
      );
      expect(comp.commandsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Plant query and add missing value', () => {
      const commandItem: ICommandItem = { id: 456 };
      const plant: IPlant = { id: 38461 };
      commandItem.plant = plant;

      const plantCollection: IPlant[] = [{ id: 62597 }];
      jest.spyOn(plantService, 'query').mockReturnValue(of(new HttpResponse({ body: plantCollection })));
      const additionalPlants = [plant];
      const expectedCollection: IPlant[] = [...additionalPlants, ...plantCollection];
      jest.spyOn(plantService, 'addPlantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commandItem });
      comp.ngOnInit();

      expect(plantService.query).toHaveBeenCalled();
      expect(plantService.addPlantToCollectionIfMissing).toHaveBeenCalledWith(
        plantCollection,
        ...additionalPlants.map(expect.objectContaining)
      );
      expect(comp.plantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const commandItem: ICommandItem = { id: 456 };
      const command: ICommand = { id: 53197 };
      commandItem.command = command;
      const plant: IPlant = { id: 45534 };
      commandItem.plant = plant;

      activatedRoute.data = of({ commandItem });
      comp.ngOnInit();

      expect(comp.commandsSharedCollection).toContain(command);
      expect(comp.plantsSharedCollection).toContain(plant);
      expect(comp.commandItem).toEqual(commandItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommandItem>>();
      const commandItem = { id: 123 };
      jest.spyOn(commandItemFormService, 'getCommandItem').mockReturnValue(commandItem);
      jest.spyOn(commandItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commandItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commandItem }));
      saveSubject.complete();

      // THEN
      expect(commandItemFormService.getCommandItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(commandItemService.update).toHaveBeenCalledWith(expect.objectContaining(commandItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommandItem>>();
      const commandItem = { id: 123 };
      jest.spyOn(commandItemFormService, 'getCommandItem').mockReturnValue({ id: null });
      jest.spyOn(commandItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commandItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commandItem }));
      saveSubject.complete();

      // THEN
      expect(commandItemFormService.getCommandItem).toHaveBeenCalled();
      expect(commandItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommandItem>>();
      const commandItem = { id: 123 };
      jest.spyOn(commandItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commandItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commandItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCommand', () => {
      it('Should forward to commandService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(commandService, 'compareCommand');
        comp.compareCommand(entity, entity2);
        expect(commandService.compareCommand).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePlant', () => {
      it('Should forward to plantService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(plantService, 'comparePlant');
        comp.comparePlant(entity, entity2);
        expect(plantService.comparePlant).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
