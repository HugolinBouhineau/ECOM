import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICommandItem } from '../command-item.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../command-item.test-samples';

import { CommandItemService } from './command-item.service';

const requireRestSample: ICommandItem = {
  ...sampleWithRequiredData,
};

describe('CommandItem Service', () => {
  let service: CommandItemService;
  let httpMock: HttpTestingController;
  let expectedResult: ICommandItem | ICommandItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CommandItemService);
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

    it('should create a CommandItem', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const commandItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(commandItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CommandItem', () => {
      const commandItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(commandItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CommandItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CommandItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CommandItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCommandItemToCollectionIfMissing', () => {
      it('should add a CommandItem to an empty array', () => {
        const commandItem: ICommandItem = sampleWithRequiredData;
        expectedResult = service.addCommandItemToCollectionIfMissing([], commandItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(commandItem);
      });

      it('should not add a CommandItem to an array that contains it', () => {
        const commandItem: ICommandItem = sampleWithRequiredData;
        const commandItemCollection: ICommandItem[] = [
          {
            ...commandItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCommandItemToCollectionIfMissing(commandItemCollection, commandItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CommandItem to an array that doesn't contain it", () => {
        const commandItem: ICommandItem = sampleWithRequiredData;
        const commandItemCollection: ICommandItem[] = [sampleWithPartialData];
        expectedResult = service.addCommandItemToCollectionIfMissing(commandItemCollection, commandItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(commandItem);
      });

      it('should add only unique CommandItem to an array', () => {
        const commandItemArray: ICommandItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const commandItemCollection: ICommandItem[] = [sampleWithRequiredData];
        expectedResult = service.addCommandItemToCollectionIfMissing(commandItemCollection, ...commandItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const commandItem: ICommandItem = sampleWithRequiredData;
        const commandItem2: ICommandItem = sampleWithPartialData;
        expectedResult = service.addCommandItemToCollectionIfMissing([], commandItem, commandItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(commandItem);
        expect(expectedResult).toContain(commandItem2);
      });

      it('should accept null and undefined values', () => {
        const commandItem: ICommandItem = sampleWithRequiredData;
        expectedResult = service.addCommandItemToCollectionIfMissing([], null, commandItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(commandItem);
      });

      it('should return initial array if no CommandItem is added', () => {
        const commandItemCollection: ICommandItem[] = [sampleWithRequiredData];
        expectedResult = service.addCommandItemToCollectionIfMissing(commandItemCollection, undefined, null);
        expect(expectedResult).toEqual(commandItemCollection);
      });
    });

    describe('compareCommandItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCommandItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCommandItem(entity1, entity2);
        const compareResult2 = service.compareCommandItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCommandItem(entity1, entity2);
        const compareResult2 = service.compareCommandItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCommandItem(entity1, entity2);
        const compareResult2 = service.compareCommandItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
