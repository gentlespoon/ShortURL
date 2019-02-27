import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse } from '../classes/apiResponse.class';
import { Injectable } from '@angular/core';
import { MessageService } from '../message/message.service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public token: string = '';
  public username: string = '';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private _router: Router
    ) {
    this.token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    this.username = localStorage.getItem('username') ? localStorage.getItem('username') : '';
  }

  public signin(email: string, password: string): void {
    this.http.post<ApiResponse>('http://localhost:3000/api/user/login', JSON.stringify({email: email, password: password}), httpOptions)
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
    this.http.post<ApiResponse>('http://localhost:3000/api/user/register', JSON.stringify({email: email, password: password}), httpOptions)
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

  public forgot(email: string): void {
    this.http.post<ApiResponse>('http://localhost:3000/api/user/forgot', JSON.stringify({email: email}), httpOptions)
    .subscribe(response=> {
      if (response.result) {
        this.messageService.newMessage(''+response.data);
      } else {
        this.messageService.newMessage(''+response.data, null, 'alert-danger');
      }
    });
  }

  public signout(): void {
    this.token = '';
    this.username = '';
    localStorage.setItem('token', this.token);
    localStorage.setItem('username', this.username);
  }

  public isAuthed(): boolean {
    return this.token ? true : false;
  }

}
