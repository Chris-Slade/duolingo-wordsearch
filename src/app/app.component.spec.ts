import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

@Component({
  selector: 'app-wordsearch',
  template: '<div></div>',
})
class MockWordsearchComponent { }

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockWordsearchComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
