import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse } from '../classes/apiResponse.class';
import { Injectable } from '@angular/core';
import { MessageService } from '../message/message.service';
import { Router } from '@angular/router';
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

  public token: string = '';
  public username: string = 'Guest';

  constructor() {
    var storedToken = localStorage.getItem('token');
    if (storedToken) {
      if (this.validateToken(storedToken)) {
        this.token = storedToken;
      }
    }
  }

  private validateToken(token: string): boolean {
    try {
      var splittedToken = token.split('.');
      if (splittedToken.length < 3) {
        throw 'failed to split token: ' + token;
      }
      var parsedTokenBody = JSON.parse(splittedToken[1]);
      if (parsedTokenBody['iss'] !== 'account.gentlespoon.com') {
        throw 'untrusted issuer';
      }
      var expirationTime = moment(parsedTokenBody['exp']).toISOString();
      if (expirationTime <= moment().toISOString()) {
        throw 'token has expired: ' + expirationTime;
      }
    } catch (ex) {
      console.warn(`[Session.Service] validateToken(): `, ex);
      return false;
    }
    return true;
  }

  public signIn(): void {
    window.location.href = `https://account.gentlespoon.com/signin?redirect=${window.location.origin}/signInLanding.php`;
  }

  public signOut(): void {
    this.token = '';
    this.username = 'Guest';
    localStorage.setItem('token', this.token);
    localStorage.setItem('urlPairs', '[]');
  }

  public isAuthed(): boolean {
    return this.token ? true : false;
  }

}
