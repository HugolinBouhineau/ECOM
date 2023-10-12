import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PlantsDetailComponent } from './plants-detail.component';

describe('Plants Management Detail Component', () => {
  let comp: PlantsDetailComponent;
  let fixture: ComponentFixture<PlantsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlantsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ plants: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PlantsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PlantsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load plants on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.plants).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
