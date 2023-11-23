import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CommandItemService } from '../service/command-item.service';

import { CommandItemComponent } from './command-item.component';

describe('CommandItem Management Component', () => {
  let comp: CommandItemComponent;
  let fixture: ComponentFixture<CommandItemComponent>;
  let service: CommandItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'command-item', component: CommandItemComponent }]), HttpClientTestingModule],
      declarations: [CommandItemComponent],
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
      .overrideTemplate(CommandItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommandItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CommandItemService);

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
    expect(comp.commandItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to commandItemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCommandItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCommandItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
