import { ApiResponse } from '../classes/apiResponse.class';
import { Injectable } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { UrlPair } from '../classes/urlPair';
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
    if (this.DEV) console.log('Loading URL Pair list');
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


  public createUrl(urlPair: UrlPair): Observable<ApiResponse> {
    return this.apiService.post('add', this.sessionService.token, urlPair);
  }



  public delete(short_url: string): void {
    if (!this.sessionService.token) {
      alert('Guests cannot delete URLs');
    }
    this.apiService.post('delete', this.sessionService.token, {short_url: short_url})
      .subscribe(response => {
        if (response.success) {
          for (let urlPairIndex = 0; urlPairIndex < this.urlPairs.length; urlPairIndex++) {
            if (this.urlPairs[urlPairIndex].short_url === short_url) {
              this.urlPairs.splice(urlPairIndex, 1);
              break;
            }
          }
        } else {
          throw 'Failed to delete urlPair: ' + response.data;
        }
      })
  }



  public getInfo(short_url: string): Observable<ApiResponse> {
    return this.apiService.post('info', this.sessionService.token, {short_url: short_url});
  }

  public getHistory(short_url: string, token: string): Observable<ApiResponse> {
    return this.apiService.post('history', token, {short_url: short_url});
  }

}
