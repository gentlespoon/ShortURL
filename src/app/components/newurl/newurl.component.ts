import { Component, OnInit } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';
import { SessionService } from 'src/app/services/session.service';
import { ShorturlService } from 'src/app/services/shorturl.service';
import { UrlPair } from '../../classes/urlpair';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newurl',
  templateUrl: './newurl.component.html',
  styleUrls: ['./newurl.component.css']
})
export class NewurlComponent implements OnInit {

  title = '';
  long_url = '';
  short_url = '';
  expire = '';

  focus = {title: false, expire: false, short_url: false, long_url: false};
  show = {title: true, expire: false, short_url: false};

  constructor(
    public shorturlService: ShorturlService,
    private clipboardService: ClipboardService,
    public sessionService: SessionService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  shorten(): void {
    if (this.long_url.indexOf('http') === -1) return;
    var urlObj = {
      long_url: this.long_url,
      short_url: this.show['short_url'] && this.short_url ? this.short_url : '',
      title: this.show['title'] && this.title ? this.title : '',
      expire: this.show['expire'] && this.expire ? this.expire : '',
    };
    this.shorturlService.newUrlPair(new UrlPair(urlObj)).subscribe(response=> {
      if (response.success) {
        var urlObj = <object>response.data;
        this.shorturlService.urlPairs.push( new UrlPair(urlObj) );
        localStorage.setItem('urlPairs', JSON.stringify(this.shorturlService.urlPairs));
        console.log('ShortURL has been created');
        this.router.navigate(['/info/' + urlObj['short_url']]);
      } else {
        console.error(response.data.toString());
      }
    });
  }

  clear(): void {
    localStorage.setItem('urlPairs', '[]');
    this.shorturlService.urlPairs = [];
  }

  copy(str: string): void {
    this.clipboardService.copyFromContent(str);
  }

  toggle(str: string): void {
    switch(str) {
      case 'short_url':
      case 'expire':
        if (!this.sessionService.token) {
          alert('This option is available to registered users only');
          return;
        }
    }
    this.show[str] = !this.show[str];
  }
  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    this.focus[name] = false;
  }

}
