import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';


const routes: Routes = [
  // { path: '', component: NewurlComponent },
  // {
  //   path: 'user', children: [
  //     {path: '', component: SessionComponent},
  //     {path: 'signin', component: SigninComponent },
  //     {path: 'signup', component: SignupComponent },
  //     {path: 'forget', component: ForgetComponent },
  //     {path: 'reset/:token', component: ResetComponent },
  //   ]
  // },
  { path: 'dashboard', component: DashboardComponent },
  // {
  //   path: 'info/:short_url', component: InfoComponent,
  // },
  // {
  //   path: 'help', children: [
  //     {path: '', component: HelpComponent},
  //     {path: 'privacyPolicy', component: PolicyPrivacyComponent},
  //     {path: 'usagePolicy', component: PolicyUsageComponent},
  //     {path: 'reportSpam', component: ReportSpamComponent},
  //     {path: 'termsOfService', component: TermsOfServiceComponent}
  //   ]
  // },
  { path: '**', redirectTo: '/', pathMatch: 'full' },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
