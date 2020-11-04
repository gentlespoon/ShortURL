import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"],
})
export class LogoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    window.location.href =
      environment.oauth.baseURL + environment.oauth.endpoints.logout;
  }
}
