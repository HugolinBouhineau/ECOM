import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlantFormService } from './plant-form.service';
import { PlantService } from '../service/plant.service';
import { IPlant } from '../plant.model';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

import { PlantUpdateComponent } from './plant-update.component';

describe('Plant Management Update Component', () => {
  let comp: PlantUpdateComponent;
  let fixture: ComponentFixture<PlantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let plantFormService: PlantFormService;
  let plantService: PlantService;
  let categoryService: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PlantUpdateComponent],
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
      .overrideTemplate(PlantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    plantFormService = TestBed.inject(PlantFormService);
    plantService = TestBed.inject(PlantService);
    categoryService = TestBed.inject(CategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Category query and add missing value', () => {
      const plant: IPlant = { id: 456 };
      const categories: ICategory[] = [{ id: 43222 }];
      plant.categories = categories;

      const categoryCollection: ICategory[] = [{ id: 51852 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [...categories];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ plant });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        categoryCollection,
        ...additionalCategories.map(expect.objectContaining)
      );
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const plant: IPlant = { id: 456 };
      const categories: ICategory = { id: 40212 };
      plant.categories = [categories];

      activatedRoute.data = of({ plant });
      comp.ngOnInit();

      expect(comp.categoriesSharedCollection).toContain(categories);
      expect(comp.plant).toEqual(plant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlant>>();
      const plant = { id: 123 };
      jest.spyOn(plantFormService, 'getPlant').mockReturnValue(plant);
      jest.spyOn(plantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plant }));
      saveSubject.complete();

      // THEN
      expect(plantFormService.getPlant).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(plantService.update).toHaveBeenCalledWith(expect.objectContaining(plant));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlant>>();
      const plant = { id: 123 };
      jest.spyOn(plantFormService, 'getPlant').mockReturnValue({ id: null });
      jest.spyOn(plantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plant: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plant }));
      saveSubject.complete();

      // THEN
      expect(plantFormService.getPlant).toHaveBeenCalled();
      expect(plantService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlant>>();
      const plant = { id: 123 };
      jest.spyOn(plantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(plantService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCategory', () => {
      it('Should forward to categoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(categoryService, 'compareCategory');
        comp.compareCategory(entity, entity2);
        expect(categoryService.compareCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
