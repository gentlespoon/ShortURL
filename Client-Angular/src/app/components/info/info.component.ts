import { Component, OnInit } from '@angular/core';
import { UrlPair } from '../../classes/urlPair';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import * as Moment from 'moment';
import { ShorturlService } from 'src/app/services/shorturl.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  urlPair: UrlPair;
  history = [];
  moment = Moment;

  constructor(
    public shorturlService: ShorturlService,
    private route: ActivatedRoute,
    private clipboardService: ClipboardService,
    private sessionService: SessionService
  ) {
  }

  ngOnInit() {
    this.shorturlService.getInfo(this.route.snapshot.paramMap.get("short_url"))
      .subscribe(response => {
        if (response.success) {
          var urlP = new UrlPair(response.data);
          this.urlPair = urlP;
        } else {
          console.error(response.data);
        }
      });

    var token = this.sessionService.token;
    // if (token) {
      this.shorturlService.getHistory(this.route.snapshot.paramMap.get('short_url'), token)
      .subscribe(response => {
        if (response.success) {
          // console.dir(response.data);
          this.history = response.data;
        } else {
          console.error(response.data);
        }
      })
    // }

  }


  copy(str: string): void {
    this.clipboardService.copyFromContent(str);
  }

}
