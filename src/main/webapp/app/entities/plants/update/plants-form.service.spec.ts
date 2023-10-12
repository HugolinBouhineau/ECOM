import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../plants.test-samples';

import { PlantsFormService } from './plants-form.service';

describe('Plants Form Service', () => {
  let service: PlantsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantsFormService);
  });

  describe('Service methods', () => {
    describe('createPlantsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlantsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            latinName: expect.any(Object),
            description: expect.any(Object),
            price: expect.any(Object),
            stock: expect.any(Object),
            imagePath: expect.any(Object),
            categories: expect.any(Object),
            commands: expect.any(Object),
          })
        );
      });

      it('passing IPlants should create a new form with FormGroup', () => {
        const formGroup = service.createPlantsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            latinName: expect.any(Object),
            description: expect.any(Object),
            price: expect.any(Object),
            stock: expect.any(Object),
            imagePath: expect.any(Object),
            categories: expect.any(Object),
            commands: expect.any(Object),
          })
        );
      });
    });

    describe('getPlants', () => {
      it('should return NewPlants for default Plants initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPlantsFormGroup(sampleWithNewData);

        const plants = service.getPlants(formGroup) as any;

        expect(plants).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlants for empty Plants initial value', () => {
        const formGroup = service.createPlantsFormGroup();

        const plants = service.getPlants(formGroup) as any;

        expect(plants).toMatchObject({});
      });

      it('should return IPlants', () => {
        const formGroup = service.createPlantsFormGroup(sampleWithRequiredData);

        const plants = service.getPlants(formGroup) as any;

        expect(plants).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlants should not enable id FormControl', () => {
        const formGroup = service.createPlantsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlants should disable id FormControl', () => {
        const formGroup = service.createPlantsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
