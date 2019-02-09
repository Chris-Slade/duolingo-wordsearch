import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PuzzleApiService } from './services/puzzle-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('jumboTitle') jumboTitleElem: ElementRef;
  @ViewChild('jumboLogo') jumboLogoElem: ElementRef;
  logoHeight: number;
  private puzzleApi: PuzzleApiService;

  constructor(private _puzzleApi: PuzzleApiService) {
    this.puzzleApi = _puzzleApi;
  }

  ngOnInit(): void {
    console.log(this.jumboTitleElem); // XXX
    this.logoHeight = this.jumboTitleElem.nativeElement.offsetHeight;
  }

}
