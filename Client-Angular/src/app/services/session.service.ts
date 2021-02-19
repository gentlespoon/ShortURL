import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import * as moment from "moment";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import * as crypto from "crypto-js";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  private DEV = true;

  constructor(private router: Router, private http: HttpClient) {
    // resume session
    console.log("[Session.Service] constructor(): restoring session");
    var accessToken = localStorage.getItem("token.access");
    this.introspectToken(accessToken, (tokenInfo) => {
      if (tokenInfo["active"]) {
        console.log("[Session.Service] constructor(): session restored");
      } else {
        let refreshToken = localStorage.getItem("token.refresh");
        if (refreshToken) {
          this.getTokenWithRefreshToken(refreshToken);
        }
        console.log("[Session.Service] constructor(): session expired");
      }
    });
  }

  private _email = "";
  private _username = "";

  public get email(): string {
    return this._email;
  }
  public get username(): string {
    return this._username;
  }

  public get token(): string {
    let accessToken = localStorage.getItem("token.access");
    return accessToken ? accessToken : "";
  }

  private setAccessToken(token: string): void {
    localStorage.setItem("token.access", token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem("token.refresh", token);
  }

  private killSession() {
    localStorage.removeItem("token.access");
    localStorage.removeItem("token.refresh");
    this._email = "";
    this._username = "";
  }

  private introspectToken(token: string, callback: Function = null) {
    // console.log('SessionService: validateToken(' + token + ')');
    const params = {
      client_id: environment.oauth.clientId,
      token: token,
    };

    let qs = new HttpParams();
    for (let paramName of Object.keys(params)) {
      qs = qs.set(paramName, params[paramName]);
    }

    let introspect =
      environment.oauth.baseURL + environment.oauth.endpoints.introspect;

    this.http
      .post(introspect, qs.toString(), {
        headers: new HttpHeaders().set(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
      })
      .subscribe(
        (response) => {
          console.log(response);
          if (response["active"]) {
            this._username = response["preferred_username"];
            this._email = response["email"];
          } else {
          }
          if (callback !== null) {
            callback(response);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public signIn() {
    localStorage.setItem("pendingRedirectUrl", this.router.url);

    const pkce_challenge = this.generate_PKCE_challenge();
    localStorage.setItem("oauth2_pkce_code_verifier", pkce_challenge[0]);

    const params = {
      client_id: environment.oauth.clientId,
      redirect_uri: location.origin + "/auth-redirect",
      response_type: "code",
      code_challenge_method: "S256",
      code_challenge: pkce_challenge[1],
      scope: "openid offline_access",
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

    var sha256ed = crypto.SHA256(code_verifier);
    var challenge = crypto.enc.Base64.stringify(sha256ed)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    return [code_verifier, challenge];
  }

  public signOut(): void {
    this.killSession();
    localStorage.setItem("pendingRedirectUrl", this.router.url);

    const params = {
      client_id: environment.oauth.clientId,
    };

    let logout = environment.oauth.baseURL + environment.oauth.endpoints.logout;

    let qs = new HttpParams();
    for (let paramName of Object.keys(params)) {
      qs = qs.set(paramName, params[paramName]);
    }

    let url = logout + "?" + qs.toString();

    window.location.href = url;
  }

  public getTokenWithAuthorizationCode(authCode: string) {
    const params = {
      client_id: environment.oauth.clientId,
      redirect_uri: location.origin + "/auth-redirect",
      grant_type: "authorization_code",
      code: authCode,
      code_verifier: localStorage.getItem("oauth2_pkce_code_verifier"),
    };
    localStorage.removeItem("oauth2_pkce_code_verifier");

    let qs = new HttpParams();
    for (let paramName of Object.keys(params)) {
      qs = qs.set(paramName, params[paramName]);
    }

    let token = environment.oauth.baseURL + environment.oauth.endpoints.token;

    this.http
      .post(token, qs.toString(), {
        headers: new HttpHeaders().set(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
      })
      .subscribe(
        (response) => {
          console.log(response);
          this.setAccessToken(response["access_token"]);
          this.setRefreshToken(response["refresh_token"]);
          this.introspectToken(response["access_token"], (tokenInfo) => {
            if (tokenInfo["active"]) {
              let url = localStorage.getItem("pendingRedirectUrl") ?? "/";
              this.router.navigate([url]);
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public getTokenWithRefreshToken(refreshToken: string) {
    const params = {
      client_id: environment.oauth.clientId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    let qs = new HttpParams();
    for (let paramName of Object.keys(params)) {
      qs = qs.set(paramName, params[paramName]);
    }

    let token = environment.oauth.baseURL + environment.oauth.endpoints.token;

    this.http
      .post(token, qs.toString(), {
        headers: new HttpHeaders().set(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
      })
      .subscribe(
        (response) => {
          console.log(response);
          this.setAccessToken(response["access_token"]);
          this.setRefreshToken(response["refresh_token"]);
          this.introspectToken(response["access_token"]);
        },
        (error) => {
          localStorage.removeItem("token.refresh");
          localStorage.removeItem("token.access");
          console.log(error);
        }
      );
  }
}
