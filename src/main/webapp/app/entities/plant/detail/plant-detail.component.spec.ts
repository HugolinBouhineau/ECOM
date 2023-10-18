import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PlantDetailComponent } from './plant-detail.component';

describe('Plant Management Detail Component', () => {
  let comp: PlantDetailComponent;
  let fixture: ComponentFixture<PlantDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlantDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ plant: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PlantDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PlantDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load plant on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.plant).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
