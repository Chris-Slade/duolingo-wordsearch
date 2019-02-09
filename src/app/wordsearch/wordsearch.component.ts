import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PuzzleApiService } from '../services/puzzle-api.service';
import { PuzzleSpec } from '../shared/types';
import { unabbreviateLanguage } from '../shared/util';

@Component({
  selector: 'app-wordsearch',
  templateUrl: './wordsearch.component.html',
  styleUrls: ['./wordsearch.component.scss']
})
export class WordsearchComponent implements OnInit {

  puzzle$: Observable<PuzzleSpec>;

  constructor(private puzzleApi: PuzzleApiService) { }

  unabbreviateLanguage = unabbreviateLanguage;

  ngOnInit() {
    this.getNewPuzzle();
  }

  getNewPuzzle(): void {
    this.puzzle$ = this.puzzleApi.getRandomPuzzle();
  }

}
