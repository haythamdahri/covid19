import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAuthorComponent } from './about-author.component';

describe('AboutAuthorComponent', () => {
  let component: AboutAuthorComponent;
  let fixture: ComponentFixture<AboutAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
