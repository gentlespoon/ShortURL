import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import * as moment from "moment";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  private DEV = false;

  constructor(private router: Router) {
    // resume session
    console.log("[Session.Service] constructor(): restoring session");
    var savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        console.log("[Session.Service] constructor(): session restored");
        this.setToken(savedToken);
      } catch (ex) {}
    }
  }

  public set tokenGrantingCode(tgc: string) {
    console.log("Token Granting Code:", tgc);
  }

  private _email = "";
  private _username = "";
  private _expire = "0";
  private _token = "";

  public get email(): string {
    return this._email;
  }
  public get username(): string {
    return this._username;
  }
  public get expire(): string {
    return this._expire;
  }

  public get token(): string {
    if (this._token) {
      try {
        this.validateToken(this._token);
        return this._token;
      } catch (ex) {
        console.warn("[Session.Service] get token(): Token not valid: ", ex);
        return "";
      }
    }
  }

  private setToken(token: string): void {
    if (token) {
      var tokenBody = this.validateToken(token);
      this._email = tokenBody["email"];
      this._username = tokenBody["username"];
      this._expire = tokenBody["exp"];
      this._token = token;
      localStorage.setItem("token", token);
    } else {
      this.killSession();
    }
  }

  private killSession() {
    localStorage.clear();
    this._email = "";
    this._expire = "";
    this._token = "";
    this._username = "";
  }

  private validateToken(token: string): object {
    // console.log('SessionService: validateToken(' + token + ')');
    try {
      if (!token) {
        throw "token not set";
      }
      var splitToken = token.split(".");
      if (splitToken.length !== 3) {
        throw "failed to split token";
      }
      try {
        var tokenBodyJSON = atob(splitToken[1]);
        var tokenBody = JSON.parse(tokenBodyJSON);
      } catch (ex) {
        throw "failed to parse token body";
      }
      var now = moment().toISOString();
      var exp = tokenBody["exp"];
      if (exp <= now) {
        throw "token expired";
      }
      return tokenBody;
    } catch (ex) {
      throw "[Session.Service] validateToken(): " + ex;
    }
  }

  public signIn() {
    localStorage.setItem("pendingRedirectUrl", this.router.url);
    this.router.navigate(["/login"]);
  }

  public signOut(): void {
    this.killSession();
    localStorage.setItem("pendingRedirectUrl", this.router.url);
    this.router.navigate(["/logout"]);
  }
}
