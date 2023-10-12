import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PlantsService } from '../service/plants.service';

import { PlantsComponent } from './plants.component';

describe('Plants Management Component', () => {
  let comp: PlantsComponent;
  let fixture: ComponentFixture<PlantsComponent>;
  let service: PlantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'plants', component: PlantsComponent }]), HttpClientTestingModule],
      declarations: [PlantsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(PlantsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlantsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PlantsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.plants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to plantsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPlantsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPlantsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
