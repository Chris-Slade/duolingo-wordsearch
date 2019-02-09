import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('jumboTitle') jumboTitleElem: ElementRef;
  @ViewChild('jumboLogo') jumboLogoElem: ElementRef;
  logoHeight: number;

  ngOnInit(): void {
    console.log(this.jumboTitleElem);
    this.logoHeight = this.jumboTitleElem.nativeElement.offsetHeight;
  }

}
