import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse } from '../classes/apiResponse.class';
import { Injectable } from '@angular/core';
import { MessageService } from '../message/message.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public token: string = '';
  public username: string = 'Guest';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private _router: Router
    ) {
    this.token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    this.username = localStorage.getItem('username') ? localStorage.getItem('username') : 'Guest';
  }

  public signin(email: string, password: string): void {
    this.http.post<ApiResponse>('/api/user/login', JSON.stringify({email: email, password: password}), httpOptions)
    .subscribe(response=> {
      if (response.result) {
        this.token = response.data['token'].toString();
        this.username = response.data['display_name'];
        localStorage.setItem('token', this.token);
        localStorage.setItem('username', this.username);
        this.messageService.newMessage('Welcome back, ' + this.username + '!');
        this._router.navigate(['/dashboard']);
      } else {
        this.messageService.newMessage(response.data.toString(), null, 'alert-danger');
      }
    });
  }

  public signup(email: string, password: string): void {
    this.http.post<ApiResponse>('/api/user/register', JSON.stringify({email: email, password: password}), httpOptions)
    .subscribe(response=> {
      if (response.result) {
        this.token = response.data['token'].toString();
        this.username = response.data['display_name'];
        localStorage.setItem('token', this.token);
        localStorage.setItem('username', this.username);
        this.messageService.newMessage('Welcome, ' + this.username + '!');
        this._router.navigate(['/dashboard']);
      } else {
        this.messageService.newMessage(response.data.toString(), null, 'alert-danger');
      }
    });
  }

  public checkPasswordStrenth(password: string): string {
    if (password.length < 8)
      return 'Password must not be shorter than 8 characters.';
    if (password.match(/[A-Z]/g) === null)
      return 'Password must contain at least 1 upper case letter.';
    if (password.match(/[a-z]/g) === null)
      return 'Password must contain at least 1 lower case letter.';
    if (password.match(/[0-9]/g) === null)
      return 'Password must contain at least 1 digit.';
    return '';
  }

  public forgot(email: string): void {
    this.http.post<ApiResponse>('/api/user/forget', JSON.stringify({email: email}), httpOptions)
    .subscribe(response=> {
      if (response.result) {
        this.messageService.newMessage(''+response.data);
      } else {
        this.messageService.newMessage(''+response.data, null, 'alert-danger');
      }
    });
  }

  public checkToken(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('/api/user/checkToken', JSON.stringify({token: token}), httpOptions);
  }

  public reset(token: string, password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('/api/user/reset', JSON.stringify({token: token, password: password}), httpOptions);
  }

  public signout(): void {
    this.token = '';
    this.username = 'Guest';
    localStorage.setItem('token', this.token);
    localStorage.setItem('username', this.username);
    localStorage.setItem('urlPairs', '[]');
  }

  public isAuthed(): boolean {
    return this.token ? true : false;
  }

}
