import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { HttpParams } from "@angular/common/http";
import * as crypto from "crypto-js";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const pkce_challenge = this.generate_PKCE_challenge();
    localStorage.setItem("oauth2_pkce_code_verifier", pkce_challenge[0]);

    const params = {
      client_id: environment.oauth.clientId,
      redirect_uri: location.origin + "/auth-redirect",
      response_type: "code",
      code_challenge_method: "S256",
      code_challenge: pkce_challenge[1],
    };

    let authorize =
      environment.oauth.baseURL + environment.oauth.endpoints.authorize;

    let qs = new HttpParams();
    for (let paramName of Object.keys(params)) {
      qs = qs.set(paramName, params[paramName]);
    }

    let url = authorize + "?" + qs.toString();

    window.location.href = url;
  }

  private generate_PKCE_challenge(): [string, string] {
    const length = 64;
    var code_verifier = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      code_verifier += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    code_verifier = "1Uu-VywTrs7LpM_sLXW-ThxEh1A642FdVpBXFERtDZK1lwrX";
    // var sha256ed = hash.sha256().update(code_verifier);

    // var challenge = Base64.encodeURI(sha256ed);

    // var sha256ed = crypto.subtle.digest('SHA256', sha256ed);
    // var challenge = btoa(sha256ed);
    var sha256ed = crypto.SHA256(code_verifier);
    var challenge = crypto.enc.Base64.stringify(sha256ed)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    console.log(code_verifier);
    console.log(sha256ed);
    console.log(challenge);

    return [code_verifier, challenge];
  }
}
