import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CommandDetailComponent } from './command-detail.component';

describe('Command Management Detail Component', () => {
  let comp: CommandDetailComponent;
  let fixture: ComponentFixture<CommandDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ command: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CommandDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CommandDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load command on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.command).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
