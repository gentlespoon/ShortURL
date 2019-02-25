import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { SigninComponent } from './session/signin/signin.component';
import { SignupComponent } from './session/signup/signup.component';
import { SessionComponent } from './session/session.component';
import { DashboardComponent } from './shorturl/dashboard/dashboard.component';
import { NewurlComponent } from './shorturl/newurl/newurl.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SigninComponent,
    SignupComponent,
    SessionComponent,
    DashboardComponent,
    NewurlComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
