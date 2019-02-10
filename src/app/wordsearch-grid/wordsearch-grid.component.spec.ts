import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsearchGridComponent } from './wordsearch-grid.component';

describe('WordsearchGridComponent', () => {
  let component: WordsearchGridComponent;
  let fixture: ComponentFixture<WordsearchGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordsearchGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsearchGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
