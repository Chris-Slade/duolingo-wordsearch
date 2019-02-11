import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// @ts-ignore
import { Group, Item, Layer, Point, PointText, Project, Shape, Size } from 'paper';
import * as paper from 'paper';

import { PuzzleSpec } from '../shared/types';

enum Layers {
  Background = 0,
  Cell,
  Answer,
  Selection,
}

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
  private project: Project;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.renderPuzzle(this._puzzle);
  }

  @Input()
  set puzzle(puzzle: PuzzleSpec) {
    this._puzzle = puzzle;
    this.renderPuzzle(this._puzzle);
  }
  get puzzle(): PuzzleSpec { return this._puzzle }

  get cellSize(): number {
    return this.fontSize + this.fontSize * this.cellPaddingFactor;
  }

  /**
   * Clean up resources associated with the currently rendered puzzle
   */
  private clearContainer(): void {
    const c = this.container.nativeElement;
    while (c != null && c.firstChild != null) {
      c.removeChild(c.firstChild);
    }
    if (this.project != null) {
      const idx = paper.projects.indexOf(this.project);
      if (idx != -1) {
        paper.projects.splice(idx, 1);
      }
    }
  }

  renderPuzzle(puzzle: PuzzleSpec): void {
    this.clearContainer();
    this.canvas = document.createElement('canvas');
    this.N = puzzle.character_grid.length;
    this.size = this.N * this.cellSize;
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.container.nativeElement.appendChild(this.canvas);
    this.project = new Project(this.canvas);
    try {
      this.render();
    }
    catch (e) {
      console.log('Error rendering puzzle:', e);
    }
  }

  revealSolution(): void {
    // TODO
  }

  private getLayer(layer: Layers): Layer {
    return this.project.layers[layer];
  }

  private render(): void {
    this.createLayers();
    this.drawBackground();
    this.drawGrid();
    this.setUpMouseHandlers();
    console.log(this.project);
  }

  private createLayers(): void {
    this.project.insertLayer(Layers.Background, new Layer({ name: 'background' }));
    this.project.insertLayer(Layers.Selection, new Layer({ name: 'selection' }));
    this.project.insertLayer(Layers.Cell, new Layer({ name: 'cell' }));
  }

  private drawBackground(): void {
    this.getLayer(Layers.Background).activate();
    const background: Shape = paper.Shape.Rectangle(
      new Point(0, 0),
      new Size(this.size, this.size)
    );
    background.fillColor = 'white';
  }

  private drawGrid(): void {
    for (let x = 0; x < this.N; x++) {
      for (let y = 0; y < this.N; y++) {
        const point = new Point(x * this.cellSize, y * this.cellSize);
        this.drawCell(
          point,
          this.cellSize,
          this.puzzle.character_grid[x][y].toUpperCase()
        );
      }
    }
  }

  private drawCell(point: Point, size: number, letter: string): void {
    const borderSize = new Size(size, size);
    const cellSize   = borderSize.subtract(2);
    const cellOffset = new Point(1, 1);
    const textOffset = new Point(
      this.cellSize / 2,
      this.cellSize - (this.fontSize * this.cellPaddingFactor)
    );
    this.getLayer(Layers.Cell).activate();
    new Group([
      this.makeCellBorder(point, borderSize),
      this.makeCellBody(point.add(cellOffset), cellSize),
      this.makeLetter(point.add(textOffset), letter),
    ]);
  }

  private makeCellBody = (point: Point, size: Size): Item => Shape.Rectangle({
    point:     point,
    size:      size,
    fillColor: 'white',
    opacity:   0,
  });

  private makeCellBorder = (point: Point, borderSize: Size): Item => Shape.Rectangle({
    point: point,
    size: borderSize,
    strokeColor: 'black',
  });

  private makeLetter = (point: Point, letter: string): Item => new PointText({
    point:         point,
    content:       letter,
    fillColor:     'black',
    justification: 'center',
    fontFamily:    'mono',
    fontSize:      this.fontSize,
  });

  private setUpMouseHandlers(): void {
    this.getLayer(Layers.Cell).children.forEach(cell => {
      cell.onMouseDown = this.beginSelection.bind(this);
      cell.onMouseUp = this.beginSelection.bind(this);
    });
  }

  beginSelection(event: MouseEvent): void {
    console.log(event); // TODO
  }

  endSelection(event: MouseEvent): void {
    console.log(event); // TODO
  }

}
