import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './shorturl/dashboard/dashboard.component';
import { ForgetComponent } from './session/forget/forget.component';
import { HelpComponent } from './static/help/help.component';
import { NewCustomComponent } from './shorturl/new-custom/new-custom.component';
import { NewRandomComponent } from './shorturl/new-random/new-random.component';
import { NgModule } from '@angular/core';
import { PolicyPrivacyComponent } from './static/policy-privacy/policy-privacy.component';
import { PolicyUsageComponent } from './static/policy-usage/policy-usage.component';
import { ReportSpamComponent } from './static/report-spam/report-spam.component';
import { RetrieveComponent } from './session/retrieve/retrieve.component';
import { SessionComponent } from './session/session.component';
import { SigninComponent } from './session/signin/signin.component';
import { SignupComponent } from './session/signup/signup.component';
import { TermsOfServiceComponent } from './static/terms-of-service/terms-of-service.component';

const routes: Routes = [
  {
    path: '', component: NewRandomComponent,
  },
  {
    path: 'user', children: [
      {path: '', component: SessionComponent},
      {path: 'signin', component: SigninComponent },
      {path: 'signup', component: SignupComponent },
      {path: 'forget', component: ForgetComponent },
      {path: 'retrieve', component: RetrieveComponent },
    ]
  },
  {
    path: 'dashboard', children: [
      {path: '', component: DashboardComponent},
      {path: 'new', component: NewCustomComponent},
    ]
  },
  {
    path: 'help', children: [
      {path: '', component: SessionComponent},
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
