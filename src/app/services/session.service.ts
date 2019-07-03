import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse } from '../classes/apiResponse.class';
import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

import * as moment from 'moment';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private DEV = true;

  private _token = '';
  private _username = '';
  private _email = '';

  public get username() {
    return this._username;
  }
  public get email() {
    return this._email;
  }
  public get token() {
    return this._token;
  }

  public killSession() {
    this._token = '';
    this._username = '';
    this._email = '';
    localStorage.clear();
  }

  constructor(
    private router: Router
  ) {
    var storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        var parsedTokenBody = this.parseToken(storedToken);
        this.validateTokenBody(parsedTokenBody);
        this._email = parsedTokenBody['email'];
        this._username = parsedTokenBody['username'];
        this._token = storedToken;
      } catch(ex) {
        console.warn('[Session.Service] constructor(): Failed to restore session: ', ex);
      }

    }
  }

  private validateToken(token: string): boolean {
    try {
      var parsedTokenBody = this.parseToken(token);
      this.validateTokenBody(parsedTokenBody);
    } catch (ex) {
      console.warn(`[Session.Service] validateToken(): `, ex);
      return false;
    }
    return true;
  }

  private parseToken(token: string): object {
    var splittedToken = token.split('.');
    if (splittedToken.length < 3) {
      throw 'failed to split token: ' + token;
    }
    return JSON.parse(atob(splittedToken[1]));
  }

  private validateTokenBody(parsedToken: object) {
    // if (parsedTokenBody['iss'] !== 'api.gentlespoon.com') {
    //   throw 'untrusted issuer';
    // }
    var expirationTime = moment(parsedToken['exp']).toISOString();
    if (expirationTime <= moment().toISOString()) {
      throw 'token has expired: ' + expirationTime;
    }
  }

  public signIn(): void {
    localStorage.setItem('pendingRedirectUrl', this.router.url);
    window.location.href = `https://account.gentlespoon.com/signin?redirect=${window.location.origin}/signedInLanding.php`;
  }

  public signOut(): void {
    this.killSession();
  }

  public isAuthed(): boolean {
    return this.token ? true : false;
  }

}
