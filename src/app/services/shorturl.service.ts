import * as moment from 'moment';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse } from '../classes/apiResponse.class';
import { Injectable } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { UrlPair } from '../classes/urlpair';
import { Observable } from 'rxjs';

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
    // this.messageService.newMessage('Loading your URL list');
    this.http.post<ApiResponse>('/api/url/list', JSON.stringify({token: this.sessionService.token}), httpOptions)
    .subscribe(response=> {
      if (response.success) {
        this.urlPairs = [];
        for (var uO of response.data) {
          // console.log(uO);
          this.urlPairs.push( new UrlPair(uO) );
        }
        localStorage.setItem('urlPairs', JSON.stringify(this.urlPairs));
        // this.messageService.newMessage('URL list has been loaded.');
      } else {
        console.error(response.data.toString());
      }
    });
  }

  public newUrlPair(urlPair: UrlPair): Observable<ApiResponse> {
    if (!urlPair.long_url) {
      console.error('long_url cannot be empty');
      return;
    }

    if (!this.sessionService.token) {
      if (urlPair.short_url || urlPair.expire) {
        alert('You must sign in to use custom short_url or Expiration Date');
        return;
      }
    }
    if (!urlPair.expire) urlPair.expire = '';

    return this.http.post<ApiResponse>('/api/url/add', JSON.stringify({...urlPair, token: this.sessionService.token}), httpOptions);

  }

  public delete(short_url: string): void {
    if (!this.sessionService.token) {
      alert('Guests cannot delete URLs');
    }
    this.http.post<ApiResponse>('/api/url/delete', JSON.stringify({short_url: short_url, token: this.sessionService.token}), httpOptions)
    .subscribe(response=> {
      if (response.success) {
        this.loadList();
      } else {
        console.error(response.data.tostring());
      }
    });
  }

  public getInfo(short_url: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('/api/url/info', JSON.stringify({token: this.sessionService.token, short_url: short_url}), httpOptions);
  }

}
