import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { skip } from 'rxjs/operators';

import { PuzzleApiService } from './puzzle-api.service';
import { S3_PROXY_URL } from '../shared/tokens';
import { environment as env } from '../../environments/environment';

const MOCK_URL = 'test://';
const MOCK_DATA = `{"source_language": "en", "word": "man", "character_grid": [["i", "q", "\u00ed", "l", "n", "n", "m", "\u00f3"], ["f", "t", "v", "\u00f1", "b", "m", "h", "a"], ["h", "j", "\u00e9", "t", "e", "t", "o", "z"], ["x", "\u00e1", "o", "i", "e", "\u00f1", "m", "\u00e9"], ["q", "\u00e9", "i", "\u00f3", "q", "s", "b", "s"], ["c", "u", "m", "y", "v", "l", "r", "x"], ["\u00fc", "\u00ed", "\u00f3", "m", "o", "t", "e", "k"], ["a", "g", "r", "n", "n", "\u00f3", "s", "m"]], "word_locations": {"6,1,6,2,6,3,6,4,6,5,6,6": "hombre"}, "target_language": "es"}
{"source_language": "en", "word": "woman", "character_grid": [["v", "\u00e1", "q", "t", "b", "f", "q"], ["y", "x", "i", "a", "\u00fc", "v", "a"], ["r", "d", "y", "\u00ed", "t", "n", "a"], ["f", "v", "\u00f3", "w", "l", "a", "v"], ["b", "u", "\u00fa", "j", "q", "h", "\u00e1"], ["c", "o", "m", "u", "j", "e", "r"], ["h", "o", "d", "\u00fa", "w", "d", "\u00fc"]], "word_locations": {"2,5,3,5,4,5,5,5,6,5": "mujer"}, "target_language": "es"}`;

describe('PuzzleApiService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        [{ provide: S3_PROXY_URL, useValue: MOCK_URL }],
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: PuzzleApiService = TestBed.get(PuzzleApiService);
    expect(service).toBeTruthy();
  });

  it('should return random puzzles', done => {
    const service: PuzzleApiService = TestBed.get(PuzzleApiService);
    // First result will be an empty array
    service.getRandomPuzzle().pipe(skip(1)).subscribe(puzzle => {
      expect(puzzle).toBeDefined();
      expect('word' in puzzle).toBeTruthy();
      done();
    });
    let puzzleRequest = httpMock.expectOne(`${MOCK_URL}/${env.puzzle_file}`);
    puzzleRequest.flush(MOCK_DATA);
  });

});
