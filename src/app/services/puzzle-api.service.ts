import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { PuzzleSpec } from '../shared/types';
import { S3_PROXY_URL } from '../shared/tokens';
import { environment as env } from '../../environments/environment';
import { randomElement } from '../shared/util';

@Injectable({
  providedIn: 'root'
})
export class PuzzleApiService {

  private _puzzles: BehaviorSubject<PuzzleSpec[]> = new BehaviorSubject([]);
  lastPuzzle: PuzzleSpec;

  constructor(
    private http: HttpClient,
    @Inject(S3_PROXY_URL) private baseUrl: string
  ) {
    if (!env.production) {
      console.log(`Getting ${this.baseUrl}/${env.puzzle_file}`);
    }
    this.http.get(
      `${this.baseUrl}/${env.puzzle_file}`,
      { responseType: 'text' }
    ).pipe(
      map((file: string) => {
        if (!env.production) {
          console.log('Got file:', file);
        }
        return file.split("\n").map(line => JSON.parse(line));
      })
    ).subscribe((puzzles: PuzzleSpec[]) => {
      this._puzzles.next(puzzles);
    });
  }

  getRandomPuzzle(): Observable<PuzzleSpec> {
    return this._puzzles.pipe(
      tap(puzzles => {
        console.log('Got puzzles:', puzzles);
      }),
      map(puzzles => {
        // Make sure we don't return the same puzzle twice in a row
        while (true) {
          const puzzle = randomElement(puzzles) as PuzzleSpec;
          if (this.lastPuzzle == null
            || !PuzzleApiService.arePuzzlesEqual(puzzle, this.lastPuzzle)) {
            this.lastPuzzle = puzzle;
            return puzzle;
          }
        }
      })
    );
  }

  private static arePuzzlesEqual(puzzle1: PuzzleSpec, puzzle2: PuzzleSpec) {
    return (puzzle1.word === puzzle2.word
      && puzzle1.target_language === puzzle2.target_language
      && puzzle1.source_language === puzzle2.source_language);
  }

}
