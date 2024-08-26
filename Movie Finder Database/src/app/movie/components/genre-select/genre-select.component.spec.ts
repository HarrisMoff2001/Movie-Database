import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreSelectComponent } from './genre-select.component';

describe('GenreSelectComponent', () => {
  let component: GenreSelectComponent;
  let fixture: ComponentFixture<GenreSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenreSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
