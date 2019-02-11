import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Point, PointText, Shape, Size } from 'paper';
import * as paper from 'paper';

import { PuzzleSpec } from '../shared/types';

@Component({
  selector: 'app-wordsearch-grid',
  templateUrl: './wordsearch-grid.component.html',
  styleUrls: ['./wordsearch-grid.component.scss']
})
export class WordsearchGridComponent implements OnInit {

  private _puzzle: PuzzleSpec;

  // Dimensions for graphics
  // Base font size. Determines the size of the grid, because cells are sized
  // to fit the letters.
  @Input() fontSize: number;
  readonly cellPaddingFactor = 0.25;
  private N: number; // Number of cells
  private size = 0;

  // Elements for rendering
  @ViewChild('container')
  private container: ElementRef;
  private canvas: HTMLCanvasElement;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.renderPuzzle(this._puzzle);
  }

  @Input()
  set puzzle(puzzle: PuzzleSpec) {
    this._puzzle = puzzle;
    console.log('Got new puzzle:', this._puzzle);
    this.renderPuzzle(this._puzzle);
  }
  get puzzle(): PuzzleSpec { return this._puzzle }

  get cellSize(): number {
    return this.fontSize + this.fontSize * this.cellPaddingFactor;
  }

  clearContainer(): void {
    const c = this.container.nativeElement;
    while (c != null && c.firstChild != null) {
      c.removeChild(c.firstChild);
    }
  }

  getElementByIdOrError(id: string): any {
    const elem = document.getElementById(id);
    if (elem == null) {
      throw new Error(`Failed to get element '${id}'`);
    }
    return elem;
  }

  renderPuzzle(puzzle: PuzzleSpec): void {
    this.clearContainer();
    this.canvas = document.createElement('canvas');
    this.N = puzzle.character_grid.length;
    this.size = this.N * this.cellSize;
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.container.nativeElement.appendChild(this.canvas);
    paper.setup(this.canvas);
    this.drawGrid();
  }

  drawGrid(): void {
    const background: Shape = paper.Shape.Rectangle(
      new Point(0, 0),
      new Size(this.size, this.size)
    );
    background.fillColor = 'white';

    const size = new Size(this.cellSize, this.cellSize);
    for (let x = 0; x < this.N; x++) {
      for (let y = 0; y < this.N; y++) {
        const point = new Point(x * this.cellSize, y * this.cellSize);
        const rect: Shape = paper.Shape.Rectangle(point, size);
        console.log('Drawing rectangle', rect);
        rect.strokeColor = 'black';

        const offset = new Point(
          this.cellSize / 2,
          this.cellSize - (this.fontSize * this.cellPaddingFactor)
        );
        const text = new PointText(point.add(offset));
        text.justification = 'center';
        text.fontFamily = 'mono';
        text.fontSize = this.fontSize;
        text.fillColor = 'black';
        text.content = this.puzzle.character_grid[x][y].toUpperCase();
      }
    }
  }

  revealSolution(): void {
    // TODO
  }

}
