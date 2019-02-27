import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse } from '../classes/apiResponse.class';
import { MessageService } from '../message/message.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    ) { }

  public validate(email: string): boolean {
    // console.log('checking email format');
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  public lastCheckedEmailDuplicate = false;
  public checkDuplicateEmail(email: string): void {
    this.http.post<ApiResponse>('/api/user/checkDuplicateEmail', JSON.stringify({email: email}), httpOptions)
    .subscribe(response=> {
      if (!response.result) {
        this.lastCheckedEmailDuplicate = true;
        this.messageService.newMessage(''+response.data, null, 'alert-danger');
      } else {
        this.lastCheckedEmailDuplicate = false;
      }
    });
  }

}

