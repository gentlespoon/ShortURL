import { Component, OnInit } from '@angular/core';
import { UrlPair } from '../../classes/urlpair';
import { Router, ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import * as Moment from 'moment';
import { ShorturlService } from 'src/app/services/shorturl.service';

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
    private router: Router,
    private clipboardService: ClipboardService,
  ) {
    this.moment = Moment;
  }

  ngOnInit() {
    this.shorturlService.getInfo(this.route.snapshot.paramMap.get("short_url")).subscribe(response => {
      if (response.success) {
        this.urlPair = <UrlPair>response.data;
        // console.log(this.urlPair);
      } else {
        console.error(response.data);
        this.router.navigate(['/dashboard']);
      }
    });
  }


  copy(str: string): void {
    this.clipboardService.copyFromContent(str);
  }

}
