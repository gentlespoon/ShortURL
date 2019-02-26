import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private token: string;
  private username: string;

  constructor() {}

  public isAuthed(): boolean {
    return this.token ? true : false;
  }

  public getToken(): string {
    return this.token;
  }

  public setToken(value: string) {
    this.token = value;
  }



}
