import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { DashboardComponent } from './shorturl/dashboard/dashboard.component';
import { EmailService } from './shorturl/email.service';
import { FooterComponent } from './pageframe/footer/footer.component';
import { ForgetComponent } from './session/forget/forget.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './pageframe/header/header.component';
import { HelpComponent } from './static/help/help.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageComponent } from './message/message.component';
import { NewurlComponent } from './shorturl/newurl/newurl.component';
import { NgModule } from '@angular/core';
import { PolicyPrivacyComponent } from './static/policy-privacy/policy-privacy.component';
import { PolicyUsageComponent } from './static/policy-usage/policy-usage.component';
import { ReportSpamComponent } from './static/report-spam/report-spam.component';
import { RetrieveComponent } from './session/retrieve/retrieve.component';
import { SessionComponent } from './session/session.component';
import { SessionService } from './session/session.service';
import { SigninComponent } from './session/signin/signin.component';
import { SignupComponent } from './session/signup/signup.component';
import { TermsOfServiceComponent } from './static/terms-of-service/terms-of-service.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    ForgetComponent,
    HeaderComponent,
    HelpComponent,
    MessageComponent,
    NewurlComponent,
    PolicyPrivacyComponent,
    PolicyUsageComponent,
    ReportSpamComponent,
    RetrieveComponent,
    SessionComponent,
    SigninComponent,
    SignupComponent,
    TermsOfServiceComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ClipboardModule,
  ],
  providers: [SessionService, EmailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
