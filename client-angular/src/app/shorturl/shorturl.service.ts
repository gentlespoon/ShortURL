import * as moment from 'moment';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse } from '../classes/apiResponse.class';
import { Injectable } from '@angular/core';
import { MessageService } from '../message/message.service';
import { SessionService } from '../session/session.service';
import { UrlPair } from './urlpair';

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
    this.urlPairs = [];
    var localUrlPairs = localStorage.getItem('urlPairs');
    if (localUrlPairs) {
      for (var upObj of JSON.parse(localUrlPairs)) {
        this.urlPairs.push(new UrlPair(upObj));
      }
    }
  }

  public loadList(): void {
    this.http.post<ApiResponse>('/api/url/list', JSON.stringify({token: this.sessionService.token}), httpOptions)
    .subscribe(response=> {
      if (response.result) {
        this.urlPairs = [];
        for (var uO of response.data) {
          console.log(uO);
          this.urlPairs.push( new UrlPair(uO) );
        }
        localStorage.setItem('urlPairs', JSON.stringify(this.urlPairs));
      } else {
        this.messageService.newMessage(response.data.toString(), null, 'alert-danger');
      }
    });
  }

  public newUrlPair(urlPair: UrlPair): void {
    if (!urlPair.long_url) {
      this.messageService.newMessage('long_url cannot be empty.', null, 'alert-danger');
      return;
    }

    if (!this.sessionService.token.length) {
      if (urlPair.short_url || urlPair.expire) {
        this.messageService.newMessage('You must sign in to use custom short_url or Expiration Date', null, 'alert-danger');
        return;
      }
    }
    if (!urlPair.expire) urlPair.expire = moment().add(1, 'y').toISOString();

    this.http.post<ApiResponse>('/api/url/add', JSON.stringify({...urlPair, token: this.sessionService.token}), httpOptions)
    .subscribe(response=> {
      if (response.result) {
        var urlObj = <object>response.data;
        this.urlPairs.push( new UrlPair(urlObj) );
        localStorage.setItem('urlPairs', JSON.stringify(this.urlPairs));
      } else {
        this.messageService.newMessage(response.data.toString(), null, 'alert-danger');
      }
    });
  }

  public delete(short_url: string): void {
    if (!this.sessionService.token) {
      this.messageService.newMessage('Permission denied. Guests cannot delete urls.', null, 'alert-danger');
    }
    this.http.post<ApiResponse>('/api/url/delete', JSON.stringify({short_url: short_url, token: this.sessionService.token}), httpOptions)
    .subscribe(response=> {
      if (response.result) {
        this.loadList();
      } else {
        this.messageService.newMessage(response.data.toString(), null, 'alert-danger');
      }
    });
  }


}
