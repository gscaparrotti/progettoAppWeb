import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { Form1Component } from './form1/form1.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PenaComponent } from './pena/pena.component';
import {TestService} from './test.service';
import {HttpClientModule} from '@angular/common/http';
import {StockService} from './stock.service';

@NgModule({
  declarations: [
    AppComponent,
    Form1Component,
    PenaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    TestService,
    StockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
