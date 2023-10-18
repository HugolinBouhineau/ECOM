import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlant } from '../plant.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../plant.test-samples';

import { PlantService } from './plant.service';

const requireRestSample: IPlant = {
  ...sampleWithRequiredData,
};

describe('Plant Service', () => {
  let service: PlantService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlant | IPlant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Plant', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const plant = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(plant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Plant', () => {
      const plant = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(plant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Plant', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Plant', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Plant', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlantToCollectionIfMissing', () => {
      it('should add a Plant to an empty array', () => {
        const plant: IPlant = sampleWithRequiredData;
        expectedResult = service.addPlantToCollectionIfMissing([], plant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plant);
      });

      it('should not add a Plant to an array that contains it', () => {
        const plant: IPlant = sampleWithRequiredData;
        const plantCollection: IPlant[] = [
          {
            ...plant,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlantToCollectionIfMissing(plantCollection, plant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Plant to an array that doesn't contain it", () => {
        const plant: IPlant = sampleWithRequiredData;
        const plantCollection: IPlant[] = [sampleWithPartialData];
        expectedResult = service.addPlantToCollectionIfMissing(plantCollection, plant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plant);
      });

      it('should add only unique Plant to an array', () => {
        const plantArray: IPlant[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const plantCollection: IPlant[] = [sampleWithRequiredData];
        expectedResult = service.addPlantToCollectionIfMissing(plantCollection, ...plantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const plant: IPlant = sampleWithRequiredData;
        const plant2: IPlant = sampleWithPartialData;
        expectedResult = service.addPlantToCollectionIfMissing([], plant, plant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plant);
        expect(expectedResult).toContain(plant2);
      });

      it('should accept null and undefined values', () => {
        const plant: IPlant = sampleWithRequiredData;
        expectedResult = service.addPlantToCollectionIfMissing([], null, plant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plant);
      });

      it('should return initial array if no Plant is added', () => {
        const plantCollection: IPlant[] = [sampleWithRequiredData];
        expectedResult = service.addPlantToCollectionIfMissing(plantCollection, undefined, null);
        expect(expectedResult).toEqual(plantCollection);
      });
    });

    describe('comparePlant', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlant(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePlant(entity1, entity2);
        const compareResult2 = service.comparePlant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePlant(entity1, entity2);
        const compareResult2 = service.comparePlant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePlant(entity1, entity2);
        const compareResult2 = service.comparePlant(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
