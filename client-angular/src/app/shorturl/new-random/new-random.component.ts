import { Component, OnInit } from '@angular/core';
import { ShorturlService } from '../shorturl.service';
import { MessageService } from 'src/app/message/message.service';
import { EmailService } from '../email.service';
import { SessionService } from 'src/app/session/session.service';
import { ClipboardService } from 'ngx-clipboard';


@Component({
  selector: 'app-new-random',
  templateUrl: './new-random.component.html',
  styleUrls: ['./new-random.component.css']
})
export class NewRandomComponent implements OnInit {

  title = '';
  longURL = '';
  focus = [];
  showTitle = false;

  constructor(
    public shorturlService: ShorturlService,
    public messageService: MessageService,
    public emailService: EmailService,
    private _clipboardService: ClipboardService
  ) { }

  ngOnInit() {
  }

  shorten(): void {
    if (!this.longURL) return;
    this.shorturlService.newRandom(this.longURL, this.title);
  }

  copy(str: string): void {
    this._clipboardService.copyFromContent(str);
  }

  toggleTitle(): void {
    this.showTitle = !this.showTitle;
  }
  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    this.focus[name] = false;
  }

}
