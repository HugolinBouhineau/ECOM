import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../plant.test-samples';

import { PlantFormService } from './plant-form.service';

describe('Plant Form Service', () => {
  let service: PlantFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantFormService);
  });

  describe('Service methods', () => {
    describe('createPlantFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlantFormGroup();

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
          })
        );
      });

      it('passing IPlant should create a new form with FormGroup', () => {
        const formGroup = service.createPlantFormGroup(sampleWithRequiredData);

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
          })
        );
      });
    });

    describe('getPlant', () => {
      it('should return NewPlant for default Plant initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPlantFormGroup(sampleWithNewData);

        const plant = service.getPlant(formGroup) as any;

        expect(plant).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlant for empty Plant initial value', () => {
        const formGroup = service.createPlantFormGroup();

        const plant = service.getPlant(formGroup) as any;

        expect(plant).toMatchObject({});
      });

      it('should return IPlant', () => {
        const formGroup = service.createPlantFormGroup(sampleWithRequiredData);

        const plant = service.getPlant(formGroup) as any;

        expect(plant).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlant should not enable id FormControl', () => {
        const formGroup = service.createPlantFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlant should disable id FormControl', () => {
        const formGroup = service.createPlantFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
