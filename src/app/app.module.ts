import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { S3_PROXY_URL } from './shared/tokens';
import { AppComponent } from './app.component';
import { PuzzleApiModule } from './services/puzzle-api.module';
import { WordsearchComponent } from './wordsearch/wordsearch.component';

function getBaseApiUrl() {
  return `${location.protocol}//${location.host}/s3proxy`;
}

@NgModule({
  declarations: [
    AppComponent,
    WordsearchComponent,
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
