import { ApiResponse } from '../classes/apiResponse.class';
import { Injectable } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { UrlPair } from '../classes/urlpair';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ShorturlService {

  private DEV = true;

  public urlPairs: UrlPair[];
  public siteURL: string = window.location.origin + '/';

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
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
    if (this.DEV) console.log('Loading your URL list');
    this.apiService.post('list', this.sessionService.token, {})
    .subscribe(response=> {
      if (response.success) {
        this.urlPairs = [];
        for (var uO of response.data) {
          // console.log(uO);
          this.urlPairs.push(new UrlPair(uO));
        }
        localStorage.setItem('urlPairs', JSON.stringify(this.urlPairs));
        if (this.DEV) console.log('URL list has been loaded.');
      } else {
        console.error(response.data);
      }
    });
  }


  public newUrlPair(urlPair: UrlPair): Observable<ApiResponse> {
    if (!urlPair.long_url) {
      throw 'long_url cannot be empty';
    }

    if (urlPair.short_url || urlPair.expire) {
      if (this.sessionService.token) {
        throw 'You must sign in to use custom short_url or expiration date';
      }
    }

    if (!urlPair.expire) urlPair.expire = '';

    return this.apiService.post('add', this.sessionService.token, urlPair);

  }



  public delete(short_url: string): void {
    if (!this.sessionService.token) {
      alert('Guests cannot delete URLs');
    }
    throw 'Not Implemented';
    // this.http.post<ApiResponse>('/api/url/delete', JSON.stringify({short_url: short_url, token: this.sessionService.token}), httpOptions)
    // .subscribe(response=> {
    //   if (response.success) {
    //     this.loadList();
    //   } else {
    //     console.error(response.data.tostring());
    //   }
    // });
  }



  public getInfo(short_url: string): Observable<ApiResponse> {
    throw 'Not Implemented';
    // return this.http.post<ApiResponse>('/api/url/info', JSON.stringify({token: this.sessionService.token, short_url: short_url}), httpOptions);
  }

}
