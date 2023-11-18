import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../command.test-samples';

import { CommandFormService } from './command-form.service';

describe('Command Form Service', () => {
  let service: CommandFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandFormService);
  });

  describe('Service methods', () => {
    describe('createCommandFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCommandFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            state: expect.any(Object),
            purchaseDate: expect.any(Object),
            customer: expect.any(Object),
            address: expect.any(Object),
          })
        );
      });

      it('passing ICommand should create a new form with FormGroup', () => {
        const formGroup = service.createCommandFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            state: expect.any(Object),
            purchaseDate: expect.any(Object),
            customer: expect.any(Object),
            address: expect.any(Object),
          })
        );
      });
    });

    describe('getCommand', () => {
      it('should return NewCommand for default Command initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCommandFormGroup(sampleWithNewData);

        const command = service.getCommand(formGroup) as any;

        expect(command).toMatchObject(sampleWithNewData);
      });

      it('should return NewCommand for empty Command initial value', () => {
        const formGroup = service.createCommandFormGroup();

        const command = service.getCommand(formGroup) as any;

        expect(command).toMatchObject({});
      });

      it('should return ICommand', () => {
        const formGroup = service.createCommandFormGroup(sampleWithRequiredData);

        const command = service.getCommand(formGroup) as any;

        expect(command).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICommand should not enable id FormControl', () => {
        const formGroup = service.createCommandFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCommand should disable id FormControl', () => {
        const formGroup = service.createCommandFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
