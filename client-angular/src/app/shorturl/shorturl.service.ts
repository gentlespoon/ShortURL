import { Injectable } from '@angular/core';
import { MessageService } from '../message/message.service';
import { SessionService } from '../session/session.service';
import { UrlPair } from './urlpair';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../classes/apiResponse.class';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class ShorturlService {

  public urlPairs: UrlPair[];
  public siteURL: string = 'https://gtspn.com/';

  constructor(
    private messageService: MessageService,
    private sessionService: SessionService,
    private http: HttpClient,
  ) {
    this.urlPairs = localStorage.getItem('urlPairs') ? JSON.parse(localStorage.getItem('urlPairs')) : [];
  }

  public newRandom(longURL: string, title: string = '', expire: string = ''): void {
    if (!longURL) {
      this.messageService.newMessage('URL cannot be empty.');
      return;
    }

    this.http.post<ApiResponse>('/api/url/addRandom', JSON.stringify({long_url: longURL, title: title}), httpOptions)
    .subscribe(response=> {
      if (response.result) {
        var UrlObj = {shortURL: response.data, title: title, longURL: longURL};
        console.log(this);
        this.urlPairs.push( new UrlPair(UrlObj) );
        localStorage.setItem('urlPairs', JSON.stringify(this.urlPairs));
      } else {
        this.messageService.newMessage(response.data.toString(), null, 'alert-danger');
      }
    });
  }

  public newCustom(longURL: string, shortURL: string, expire: string): void {
    if (!this.sessionService.isAuthed()) {
      this.messageService.newMessage('You must sign in to create custom URL.');
      return;
    }
    // var URLobj = {...arguments, account_id: }
  }


}
