import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Form1Component} from './fake/form1.component';

const routes: Routes = [
  { path: 'fake', component: Form1Component }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
