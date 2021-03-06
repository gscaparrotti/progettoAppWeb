import {Component, NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Form1Component} from './form1/form1.component';
import {PenaComponent} from './pena/pena.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LoginComponent} from './login/login.component';
import {PersonalPageComponent} from './personal-page/personal-page.component';
import {AdminPageComponent} from './admin-page/admin-page.component';

const routes: Routes = [
  { path: 'form1', component: Form1Component},
  { path: 'pena', component: PenaComponent},
  { path: 'signup', component: SignUpComponent},
  { path: 'login', component: LoginComponent},
  { path: 'personal-page', component: PersonalPageComponent},
  { path: 'admin-page', component: AdminPageComponent},
  { path: '', redirectTo: '/form1', pathMatch: 'full'},
  { path: '**', redirectTo: '/form1', pathMatch: 'full'}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
