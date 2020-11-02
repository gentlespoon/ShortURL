import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { NewurlComponent } from "./components/newurl/newurl.component";
import { InfoComponent } from "./components/info/info.component";
import { AuthRedirectComponent } from "./components/session/auth-redirect/auth-redirect.component";
import { LoginComponent } from "./components/session/login/login.component";
import { LogoutComponent } from "./components/session/logout/logout.component";

const routes: Routes = [
  { path: "", component: NewurlComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "info/:short_url", component: InfoComponent },
  { path: "auth-redirect", component: AuthRedirectComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
