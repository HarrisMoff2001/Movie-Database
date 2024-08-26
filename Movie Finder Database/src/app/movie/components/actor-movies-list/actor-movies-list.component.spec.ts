import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorMoviesListComponent } from './actor-movies-list.component';

describe('ActorMoviesListComponent', () => {
  let component: ActorMoviesListComponent;
  let fixture: ComponentFixture<ActorMoviesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorMoviesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorMoviesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
