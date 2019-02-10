import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

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
  private ctx: CanvasRenderingContext2D;

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
    const ctx = this.canvas.getContext('2d');
    if (ctx == null) {
      throw new Error('Failed to get CanvasRenderingContext2D');
    }
    this.ctx = ctx;
    this.N = puzzle.character_grid.length;
    this.size = this.N * this.cellSize;
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.container.nativeElement.appendChild(this.canvas);

    this.canvas.addEventListener('mousedown', this.onMousedown.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseup.bind(this));
    this.canvas.addEventListener('mousemove', this.onMousemove.bind(this));

    this.drawGrid();

  }

  drawGrid(): void {
    // Draw background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.size, this.size);
    // Draw grid
    this.ctx.fillStyle = 'black';

    this.ctx.font = `${this.fontSize}px mono`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (let x = 0; x < this.N; x++) {
      for (let y = 0; y < this.N; y++) {
        this.ctx.strokeRect(
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        this.ctx.fillText(
          this.puzzle.character_grid[x][y].toUpperCase(),
          x * this.cellSize + this.cellSize / 2,
          y * this.cellSize + this.cellSize / 2
            + (this.fontSize * this.cellPaddingFactor / 2) - 1,
        );
      }
    }
  }

  revealSolution(): void {
    // TODO
  }

  onMousedown(event: MouseEvent): void {
    // TODO
  }

  onMouseup(event: MouseEvent): void {
    // TODO
  }

  onMousemove(event: MouseEvent): void {
    // TODO
  }

}
