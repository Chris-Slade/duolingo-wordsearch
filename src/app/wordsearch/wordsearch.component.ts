import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { PuzzleApiService } from '../services/puzzle-api.service';
import { PuzzleSpec } from '../shared/types';
import { WordsearchGridComponent } from '../wordsearch-grid/wordsearch-grid.component';
import { unabbreviateLanguage } from '../shared/util';

@Component({
  selector: 'app-wordsearch',
  templateUrl: './wordsearch.component.html',
  styleUrls: ['./wordsearch.component.scss']
})
export class WordsearchComponent implements OnInit {

  puzzle$: Observable<PuzzleSpec>;
  @ViewChild('grid') grid: WordsearchGridComponent;

  constructor(private puzzleApi: PuzzleApiService) { }

  unabbreviateLanguage = unabbreviateLanguage;

  ngOnInit() {
    this.getNewPuzzle();
  }

  getNewPuzzle(): void {
    this.puzzle$ = this.puzzleApi.getRandomPuzzle();
  }

  revealSolution(): void {
    this.grid.revealSolution();
  }

}
