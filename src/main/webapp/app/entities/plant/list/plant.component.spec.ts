import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PlantService } from '../service/plant.service';

import { PlantComponent } from './plant.component';

describe('Plant Management Component', () => {
  let comp: PlantComponent;
  let fixture: ComponentFixture<PlantComponent>;
  let service: PlantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'plant', component: PlantComponent }]), HttpClientTestingModule],
      declarations: [PlantComponent],
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
      .overrideTemplate(PlantComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlantComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PlantService);

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
    it('Should forward to plantService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPlantIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPlantIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
