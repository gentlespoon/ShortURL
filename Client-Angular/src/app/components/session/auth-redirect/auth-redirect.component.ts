import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SessionService } from "src/app/services/session.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-auth-redirect",
  templateUrl: "./auth-redirect.component.html",
  styleUrls: ["./auth-redirect.component.scss"],
})
export class AuthRedirectComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    // const userState = this.activatedRoute.snapshot.paramMap.get("userState");
    // console.log(this.activatedRoute.queryParams._value);

    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      if (Object.keys(params).length > 0) {
        this.authorizationCode = params["code"];
        this.sessionService.tokenGrantingCode = params["code"];
      }
    });
  }

  public clientId = environment.oauth.clientId;

  public authorizationCode: string;

  public get codeVerifier() {
    return localStorage.getItem("oauth2_pkce_code_verifier");
  }
}
