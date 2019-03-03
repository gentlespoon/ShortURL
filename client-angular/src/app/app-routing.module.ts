import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './shorturl/dashboard/dashboard.component';
import { ForgetComponent } from './session/forget/forget.component';
import { HelpComponent } from './static/help/help.component';
import { NewurlComponent } from './shorturl/newurl/newurl.component';
import { NgModule } from '@angular/core';
import { PolicyPrivacyComponent } from './static/policy-privacy/policy-privacy.component';
import { PolicyUsageComponent } from './static/policy-usage/policy-usage.component';
import { ReportSpamComponent } from './static/report-spam/report-spam.component';
import { ResetComponent } from './session/reset/reset.component';
import { SessionComponent } from './session/session.component';
import { SigninComponent } from './session/signin/signin.component';
import { SignupComponent } from './session/signup/signup.component';
import { TermsOfServiceComponent } from './static/terms-of-service/terms-of-service.component';
import { InfoComponent } from './shorturl/info/info.component';

const routes: Routes = [
  {
    path: '', component: NewurlComponent,
  },
  {
    path: 'user', children: [
      {path: '', component: SessionComponent},
      {path: 'signin', component: SigninComponent },
      {path: 'signup', component: SignupComponent },
      {path: 'forget', component: ForgetComponent },
      {path: 'reset/:token', component: ResetComponent },
    ]
  },
  {
    path: 'dashboard', children: [
      {path: '', component: DashboardComponent},
    ]
  },
  {
    path: 'info/:short_url', component: InfoComponent,
  },
  {
    path: 'help', children: [
      {path: '', component: HelpComponent},
      {path: 'privacyPolicy', component: PolicyPrivacyComponent},
      {path: 'usagePolicy', component: PolicyUsageComponent},
      {path: 'reportSpam', component: ReportSpamComponent},
      {path: 'termsOfService', component: TermsOfServiceComponent}
    ]
  }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})


export class AppRoutingModule { }


