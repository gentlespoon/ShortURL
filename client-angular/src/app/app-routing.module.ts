import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './session/signin/signin.component';
import { SignupComponent } from './session/signup/signup.component';
import { SessionComponent } from './session/session.component';
import { DashboardComponent } from './shorturl/dashboard/dashboard.component';
import { NewurlComponent } from './shorturl/newurl/newurl.component';

const routes: Routes = [
  {path: 'user', component: SessionComponent, children: [
    {path: 'signin', component: SigninComponent },
    {path: 'signup', component: SignupComponent },
  ]},
  {path: 'dashboard', component: DashboardComponent, children: [
    {path: 'new', component: NewurlComponent},
  ]},
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})


export class AppRoutingModule { }
