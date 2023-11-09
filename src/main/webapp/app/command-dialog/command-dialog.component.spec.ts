import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandDialogComponent } from './command-dialog.component';

describe('CommandDialogComponent', () => {
  let component: CommandDialogComponent;
  let fixture: ComponentFixture<CommandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
