import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchListsComponent } from './watch-list.component';

describe('WatchListsComponent', () => {
  let component: WatchListsComponent;
  let fixture: ComponentFixture<WatchListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchListsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
