import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../command-item.test-samples';

import { CommandItemFormService } from './command-item-form.service';

describe('CommandItem Form Service', () => {
  let service: CommandItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandItemFormService);
  });

  describe('Service methods', () => {
    describe('createCommandItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCommandItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            command: expect.any(Object),
            plant: expect.any(Object),
          })
        );
      });

      it('passing ICommandItem should create a new form with FormGroup', () => {
        const formGroup = service.createCommandItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            command: expect.any(Object),
            plant: expect.any(Object),
          })
        );
      });
    });

    describe('getCommandItem', () => {
      it('should return NewCommandItem for default CommandItem initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCommandItemFormGroup(sampleWithNewData);

        const commandItem = service.getCommandItem(formGroup) as any;

        expect(commandItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewCommandItem for empty CommandItem initial value', () => {
        const formGroup = service.createCommandItemFormGroup();

        const commandItem = service.getCommandItem(formGroup) as any;

        expect(commandItem).toMatchObject({});
      });

      it('should return ICommandItem', () => {
        const formGroup = service.createCommandItemFormGroup(sampleWithRequiredData);

        const commandItem = service.getCommandItem(formGroup) as any;

        expect(commandItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICommandItem should not enable id FormControl', () => {
        const formGroup = service.createCommandItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCommandItem should disable id FormControl', () => {
        const formGroup = service.createCommandItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
