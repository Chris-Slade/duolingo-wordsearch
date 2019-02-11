import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// @ts-ignore
import { Item, Layer, Point, PointText, Project, Shape, Size } from 'paper';
import * as paper from 'paper';

import { PuzzleSpec } from '../shared/types';

enum Layers {
  Background = 0,
  Letters,
  Border,
  Selection,
  Cell,
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

  private createLayers(): void {
    this.project.insertLayer(Layers.Background, new Layer());
    this.project.insertLayer(Layers.Letters, new Layer());
    this.project.insertLayer(Layers.Border, new Layer());
    this.project.insertLayer(Layers.Selection, new Layer());
    this.project.insertLayer(Layers.Cell, new Layer());
  }

  private drawBackground(): void {
    this.getLayer(Layers.Background).activate();
    const background: Shape = paper.Shape.Rectangle(
      new Point(0, 0),
      new Size(this.size, this.size)
    );
    background.fillColor = 'white';
  }

  private render(): void {
    this.createLayers();
    this.drawBackground();
    this.drawGrid();
    this.setUpMouseHandlers();
  }

  private drawGrid(): void {
    const borderSize = new Size(this.cellSize, this.cellSize);
    const cellSize   = new Size(this.cellSize - 2, this.cellSize - 2);
    const cellOffset = new Point(1, 1);
    const textOffset = new Point(
      this.cellSize / 2,
      this.cellSize - (this.fontSize * this.cellPaddingFactor)
    );

    for (let x = 0; x < this.N; x++) {
      for (let y = 0; y < this.N; y++) {
        const point = new Point(x * this.cellSize, y * this.cellSize);
        this.drawCellBorder(point, borderSize);
        this.drawCell(point.add(cellOffset), cellSize);
        this.drawLetter(
          point.add(textOffset),
          this.puzzle.character_grid[x][y].toUpperCase()
        );
      }
    }
  }

  private drawCellBorder(point: Point, borderSize: Size): void {
    this.getLayer(Layers.Border).activate();
    const border: Shape = Shape.Rectangle(point, borderSize);
    border.strokeColor = 'black';
  }

  private drawCell(point: Point, cellSize: Size): void {
    this.getLayer(Layers.Cell).activate();
    Shape.Rectangle({
      point:     point,
      size:      cellSize,
      fillColor: 'white',
      opacity:   0,
    });
  }

  private drawLetter(point: Point, letter: string): void {
    this.getLayer(Layers.Letters).activate();
    new PointText({
      point:         point,
      content:       letter,
      fillColor:     'black',
      justification: 'center',
      fontFamily:    'mono',
      fontSize:      this.fontSize,
    });
  }

  private setUpMouseHandlers(): void {
    this.getLayer(Layers.Cell).children.forEach(cell => {
      cell.onMouseDown = this.beginSelection.bind(this);
      cell.onMouseUp   = this.endSelection.bind(this);
    });
  }

  beginSelection(event: MouseEvent): void {
    console.log(event); // TODO
  }

  endSelection(event: MouseEvent): void {
    console.log(event); // TODO
  }

}
