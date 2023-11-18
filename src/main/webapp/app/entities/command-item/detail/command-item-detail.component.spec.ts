import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CommandItemDetailComponent } from './command-item-detail.component';

describe('CommandItem Management Detail Component', () => {
  let comp: CommandItemDetailComponent;
  let fixture: ComponentFixture<CommandItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ commandItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CommandItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CommandItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load commandItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.commandItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
