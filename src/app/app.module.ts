import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { Form1Component } from './form1/form1.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PenaComponent } from './pena/pena.component';
import {ServerinteractorService} from './serverinteractor.service';
import {HttpClientModule} from '@angular/common/http';
import {StockService} from './stock.service';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { PersonalPageComponent } from './personal-page/personal-page.component';
import {NgTsSpinnerModule} from 'ng-ts-spinner';

@NgModule({
  declarations: [
    AppComponent,
    Form1Component,
    PenaComponent,
    SignUpComponent,
    HeaderComponent,
    LoginComponent,
    PersonalPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgTsSpinnerModule
  ],
  providers: [
    ServerinteractorService,
    StockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
