import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { PuzzleApiModule } from './services/puzzle-api.module';
import { S3_PROXY_URL } from './shared/tokens';
import { WordsearchComponent } from './wordsearch/wordsearch.component';
import { WordsearchGridComponent } from './wordsearch-grid/wordsearch-grid.component';

function getBaseApiUrl() {
  return `${location.protocol}//${location.host}/s3proxy`;
}

@NgModule({
  declarations: [
    AppComponent,
    WordsearchComponent,
    WordsearchGridComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    PuzzleApiModule,
  ],
  providers: [
    [{ provide: S3_PROXY_URL, useFactory: getBaseApiUrl }],
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
