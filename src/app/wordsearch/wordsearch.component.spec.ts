import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PuzzleApiService } from '../services/puzzle-api.service';
import { PuzzleSpec } from '../shared/types';
import { WordsearchComponent } from './wordsearch.component';

@Injectable({
  providedIn: 'root'
})
class MockPuzzleApiService {
  getRandomPuzzle(): Observable<PuzzleSpec> {
    return of({
      source_language: 'en',
      target_language: 'es',
      word: 'foo',
      character_grid: [],
      word_locations: {},
    });
  }
}

describe('WordsearchComponent', () => {
  let component: WordsearchComponent;
  let fixture: ComponentFixture<WordsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordsearchComponent ],
      providers: [
        { provide: PuzzleApiService, useClass: MockPuzzleApiService }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
