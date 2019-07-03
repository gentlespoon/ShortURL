import * as Moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { SessionService } from 'src/app/services/session.service';
import { ShorturlService } from 'src/app/services/shorturl.service';
import { UrlPair } from '../../classes/urlpair';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  focus = {};
  moment = null;

  constructor(
    public shorturlService: ShorturlService,
    private clipboardService: ClipboardService,
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
    this.clipboardService.copyFromContent(str);
  }

  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    this.focus[name] = false;
  }


}
