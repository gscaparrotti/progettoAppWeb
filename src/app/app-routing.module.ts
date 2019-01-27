import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Form1Component} from './form1/form1.component';
import {PenaComponent} from './pena/pena.component';

const routes: Routes = [
  { path: 'form1', component: Form1Component},
  { path: 'pena', component: PenaComponent}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
