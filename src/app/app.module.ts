import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { PuzzleApiService } from './services/puzzle-api.service';
import { WordsearchComponent } from './wordsearch/wordsearch.component';

@NgModule({
  declarations: [
    AppComponent,
    WordsearchComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
  ],
  providers: [
    PuzzleApiService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
