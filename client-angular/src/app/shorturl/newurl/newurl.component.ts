import { Component, OnInit } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';
import { EmailService } from '../email.service';
import { MessageService } from 'src/app/message/message.service';
import { SessionService } from 'src/app/session/session.service';
import { ShorturlService } from '../shorturl.service';
import { UrlPair } from '../../classes/urlpair';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newurl',
  templateUrl: './newurl.component.html',
  styleUrls: ['./newurl.component.css', '../shorturl.component.css']
})
export class NewurlComponent implements OnInit {

  title = '';
  long_url = '';
  short_url = '';
  expire = '';

  focus = {title: false, expire: false, short_url: false, long_url: false};
  show = {title: true, expire: false, short_url: true};

  constructor(
    public shorturlService: ShorturlService,
    public messageService: MessageService,
    public emailService: EmailService,
    private _clipboardService: ClipboardService,
    public sessionService: SessionService,
    private _router: Router,
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
      if (response.result) {
        var urlObj = <object>response.data;
        this.shorturlService.urlPairs.push( new UrlPair(urlObj) );
        localStorage.setItem('urlPairs', JSON.stringify(this.shorturlService.urlPairs));
        this.messageService.newMessage('Short URL has been created.');
        this._router.navigate(['/info/' + urlObj['short_url']]);
      } else {
        this.messageService.newMessage(response.data.toString(), null, 'alert-danger');
      }
    });
  }

  clear(): void {
    localStorage.setItem('urlPairs', '[]');
    this.shorturlService.urlPairs = [];
  }

  copy(str: string): void {
    this._clipboardService.copyFromContent(str);
  }

  toggle(str: string): void {
    this.show[str] = !this.show[str];
  }
  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    this.focus[name] = false;
  }

}
