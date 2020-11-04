import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { NewurlComponent } from "./components/newurl/newurl.component";
import { InfoComponent } from "./components/info/info.component";
import { AuthRedirectComponent } from "./components/session/auth-redirect/auth-redirect.component";

const routes: Routes = [
  { path: "", component: NewurlComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "info/:short_url", component: InfoComponent },
  { path: "auth-redirect", component: AuthRedirectComponent },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
