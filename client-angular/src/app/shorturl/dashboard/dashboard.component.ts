import * as Moment from 'moment';

import { Component, OnInit } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';
import { EmailService } from '../email.service';
import { MessageService } from 'src/app/message/message.service';
import { SessionService } from 'src/app/session/session.service';
import { ShorturlService } from '../shorturl.service';
import { UrlPair } from '../../classes/urlpair';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../shorturl.component.css']
})
export class DashboardComponent implements OnInit {

  focus = {};
  moment = null;

  constructor(
    public shorturlService: ShorturlService,
    public messageService: MessageService,
    public emailService: EmailService,
    private _clipboardService: ClipboardService,
    public sessionService: SessionService,
  ) {
    this.shorturlService.loadList();
    this.moment = Moment;
  }



  ngOnInit() {
  }

  clear(): void {
    localStorage.setItem('urlPairs', '[]');
    this.shorturlService.urlPairs = [];
  }

  delete(short_url: string): void {
    this.shorturlService.delete(short_url);
  }



  copy(str: string): void {
    this._clipboardService.copyFromContent(str);
    this.messageService.newMessage('URL has been copied to the clipboard!');
  }

  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    this.focus[name] = false;
  }


}
