import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlantsFormService } from './plants-form.service';
import { PlantsService } from '../service/plants.service';
import { IPlants } from '../plants.model';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

import { PlantsUpdateComponent } from './plants-update.component';

describe('Plants Management Update Component', () => {
  let comp: PlantsUpdateComponent;
  let fixture: ComponentFixture<PlantsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let plantsFormService: PlantsFormService;
  let plantsService: PlantsService;
  let categoryService: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PlantsUpdateComponent],
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
      .overrideTemplate(PlantsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlantsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    plantsFormService = TestBed.inject(PlantsFormService);
    plantsService = TestBed.inject(PlantsService);
    categoryService = TestBed.inject(CategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Category query and add missing value', () => {
      const plants: IPlants = { id: 456 };
      const categories: ICategory[] = [{ id: 50497 }];
      plants.categories = categories;

      const categoryCollection: ICategory[] = [{ id: 18511 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [...categories];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ plants });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        categoryCollection,
        ...additionalCategories.map(expect.objectContaining)
      );
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const plants: IPlants = { id: 456 };
      const categories: ICategory = { id: 63408 };
      plants.categories = [categories];

      activatedRoute.data = of({ plants });
      comp.ngOnInit();

      expect(comp.categoriesSharedCollection).toContain(categories);
      expect(comp.plants).toEqual(plants);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlants>>();
      const plants = { id: 123 };
      jest.spyOn(plantsFormService, 'getPlants').mockReturnValue(plants);
      jest.spyOn(plantsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plants });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plants }));
      saveSubject.complete();

      // THEN
      expect(plantsFormService.getPlants).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(plantsService.update).toHaveBeenCalledWith(expect.objectContaining(plants));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlants>>();
      const plants = { id: 123 };
      jest.spyOn(plantsFormService, 'getPlants').mockReturnValue({ id: null });
      jest.spyOn(plantsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plants: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plants }));
      saveSubject.complete();

      // THEN
      expect(plantsFormService.getPlants).toHaveBeenCalled();
      expect(plantsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlants>>();
      const plants = { id: 123 };
      jest.spyOn(plantsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plants });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(plantsService.update).toHaveBeenCalled();
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
