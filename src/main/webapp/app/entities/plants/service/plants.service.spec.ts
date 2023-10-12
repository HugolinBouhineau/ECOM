import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlants } from '../plants.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../plants.test-samples';

import { PlantsService } from './plants.service';

const requireRestSample: IPlants = {
  ...sampleWithRequiredData,
};

describe('Plants Service', () => {
  let service: PlantsService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlants | IPlants[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlantsService);
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

    it('should create a Plants', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const plants = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(plants).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Plants', () => {
      const plants = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(plants).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Plants', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Plants', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Plants', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlantsToCollectionIfMissing', () => {
      it('should add a Plants to an empty array', () => {
        const plants: IPlants = sampleWithRequiredData;
        expectedResult = service.addPlantsToCollectionIfMissing([], plants);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plants);
      });

      it('should not add a Plants to an array that contains it', () => {
        const plants: IPlants = sampleWithRequiredData;
        const plantsCollection: IPlants[] = [
          {
            ...plants,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlantsToCollectionIfMissing(plantsCollection, plants);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Plants to an array that doesn't contain it", () => {
        const plants: IPlants = sampleWithRequiredData;
        const plantsCollection: IPlants[] = [sampleWithPartialData];
        expectedResult = service.addPlantsToCollectionIfMissing(plantsCollection, plants);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plants);
      });

      it('should add only unique Plants to an array', () => {
        const plantsArray: IPlants[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const plantsCollection: IPlants[] = [sampleWithRequiredData];
        expectedResult = service.addPlantsToCollectionIfMissing(plantsCollection, ...plantsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const plants: IPlants = sampleWithRequiredData;
        const plants2: IPlants = sampleWithPartialData;
        expectedResult = service.addPlantsToCollectionIfMissing([], plants, plants2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plants);
        expect(expectedResult).toContain(plants2);
      });

      it('should accept null and undefined values', () => {
        const plants: IPlants = sampleWithRequiredData;
        expectedResult = service.addPlantsToCollectionIfMissing([], null, plants, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plants);
      });

      it('should return initial array if no Plants is added', () => {
        const plantsCollection: IPlants[] = [sampleWithRequiredData];
        expectedResult = service.addPlantsToCollectionIfMissing(plantsCollection, undefined, null);
        expect(expectedResult).toEqual(plantsCollection);
      });
    });

    describe('comparePlants', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlants(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePlants(entity1, entity2);
        const compareResult2 = service.comparePlants(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePlants(entity1, entity2);
        const compareResult2 = service.comparePlants(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePlants(entity1, entity2);
        const compareResult2 = service.comparePlants(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
