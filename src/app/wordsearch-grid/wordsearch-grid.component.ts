import * as paper from 'paper';
import { Component, ElementRef, EventEmitter, Input, ViewChild } from '@angular/core';
import { Group, Item, Layer, Path, Point, PointText, Project, Rectangle, Shape, Size } from 'paper';

import { PuzzleSpec } from '../shared/types';
import { angleBetween, midpoint } from '../shared/util';

enum Layers {
  Background = 0,
  Cell,
  Answer,
  Selection,
}

const SELECTION_COLOR = '#007BFF';

@Component({
  selector: 'app-wordsearch-grid',
  templateUrl: './wordsearch-grid.component.html',
  styleUrls: ['./wordsearch-grid.component.scss']
})
export class WordsearchGridComponent {

  private _puzzle: PuzzleSpec;

  // Dimensions for graphics
  // Base font size. Determines the size of the grid, because cells are sized
  // to fit the letters.
  @Input() fontSize: number;
  readonly cellPaddingFactor = 0.25;
  private N: number; // Number of cells
  private size = 0;
  private _solved = false;
  public solvedEvent = new EventEmitter<boolean>();

  // Elements for rendering
  @ViewChild('container')
  private container: ElementRef;
  private canvas: HTMLCanvasElement;
  private project: Project;

  constructor() { }

  @Input()
  set puzzle(puzzle: PuzzleSpec) {
    this._puzzle = puzzle;
    console.log(puzzle); // XXX
    this.renderPuzzle(this._puzzle);
  }
  get puzzle(): PuzzleSpec { return this._puzzle }

  set solved(value: boolean) {
    this._solved = value;
    this.solvedEvent.emit(value);
  }
  get solved() { return this._solved; }

  get cellSize(): number {
    return this.fontSize + this.fontSize * this.cellPaddingFactor;
  }

  private getLayer(layer: Layers): Layer {
    return this.project.layers[layer];
  }

  /**
   * Clean up resources associated with the currently rendered puzzle
   */
  private clearPuzzle(): void {
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
    this.solved = false;
  }

  private renderPuzzle(puzzle: PuzzleSpec): void {
    this.clearPuzzle();
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

  public revealSolution(): void {
    this.drawAnswerBubbles();
    this.solved = true;
  }

  private render(): void {
    this.createLayers();
    this.drawBackground();
    this.drawGrid();
    this.setUpMouseHandlers();
    console.log(this.project);
  }

  private getCellAt(x: number, y: number): Item {
    const hit = this.getLayer(Layers.Cell)
      .hitTest(new Point(x * this.cellSize, y * this.cellSize));
    if (hit != null) {
      return hit.item;
    }
    else {
      throw new Error(`Failed to find cell at (${x}, ${y})`);
    }
  }

  private drawAnswerBubbles(): void {
    this.getLayer(Layers.Answer).activate();
    for (const locString of Object.keys(this.puzzle.word_locations)) {
      const coords = locString.split(',').map(num => parseInt(num, 10));
      if (coords.length % 2 !== 0 || coords.length < 4) {
        throw new Error('Illegal format for word_locations');
      }
      this.drawAnswerBubble(
        [coords[0], coords[1]],
        [coords[coords.length - 2], coords[coords.length - 1]]
      );
    }
  }

  /**
   * Draw an answer bubble enclosing the line of cells between (ax, ay) and
   * (bx, by).
   */
  private drawAnswerBubble(start: [number, number], end: [number, number]): void {
    const startCell = this.getCellAt(...start);
    const endCell   = this.getCellAt(...end);
    const center    = midpoint(startCell.position, endCell.position);
    const width     = startCell.position.getDistance(endCell.position)
      + this.cellSize - 6;
    const height    = this.cellSize - 6;
    const rectangle = new Rectangle(
      center.subtract(new Point(width / 2, height / 2)),
      new Size(width, height),
    );
    const path = new Path.Rectangle(rectangle, this.fontSize / 2);
    path.rotate(angleBetween(startCell.position, endCell.position));
    path.strokeColor = SELECTION_COLOR;
    path.strokeWidth = 2;
  }

  private createLayers(): void {
    const newLayer = (index: number, name: string) =>
      this.project.insertLayer(index, new Layer({ name }));
    newLayer(Layers.Background, Layers[Layers.Background]);
    newLayer(Layers.Selection, Layers[Layers.Selection]);
    newLayer(Layers.Cell, Layers[Layers.Cell]);
  }

  private drawBackground(): void {
    this.getLayer(Layers.Background).activate();
    const background = Shape.Rectangle(
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
          this.puzzle.character_grid[y][x].toUpperCase()
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
