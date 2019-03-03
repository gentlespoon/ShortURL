import { Component, OnInit } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';
import { EmailService } from '../email.service';
import { MessageService } from 'src/app/message/message.service';
import { SessionService } from 'src/app/session/session.service';
import { ShorturlService } from '../shorturl.service';
import { UrlPair } from '../../classes/urlpair';

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
    this.shorturlService.newUrlPair(new UrlPair(urlObj));
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
