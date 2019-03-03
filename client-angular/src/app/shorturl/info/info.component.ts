import { Component, OnInit } from '@angular/core';
import { UrlPair } from '../../classes/urlpair';
import { SessionComponent } from 'src/app/session/session.component';
import { ShorturlService } from '../shorturl.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/message/message.service';
import { ClipboardService } from 'ngx-clipboard';
import * as Moment from 'moment';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  urlPair: UrlPair;
  moment = null;

  constructor(
    private shorturlService: ShorturlService,
    private route: ActivatedRoute,
    public messageService: MessageService,
    private _router: Router,
    private _clipboardService: ClipboardService,
  ) {
    this.moment = Moment;
  }

  ngOnInit() {
    this.shorturlService.getInfo(this.route.snapshot.paramMap.get("short_url")).subscribe(response => {
      if (response.result) {
        this.urlPair = <UrlPair>response.data;
        console.log(this.urlPair);
      } else {
        this.messageService.newMessage(response.data, null, 'alert-danger');
        this._router.navigate(['/dashboard']);
      }
    });
  }


  copy(str: string): void {
    this._clipboardService.copyFromContent(str);
    this.messageService.newMessage('URL has been copied to the clipboard!');
  }

}
