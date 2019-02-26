import { Injectable } from '@angular/core';
import { MessageService } from '../message/message.service';
import { SessionService } from '../session/session.service';
import { UrlPair } from './urlpair';

@Injectable({
  providedIn: 'root'
})
export class ShorturlService {

  public urlPairs: UrlPair[];

  public newRandom(longURL: string, title: string = '', expire: string = ''): void {
    if (!longURL) {
      this.messageService.newMessage('URL cannot be empty.');
      return;
    }
    var URLobj = {id: 'new', shortURL: ''}
    this.urlPairs.push(new UrlPair(URLobj));
  }

  public newCustom(longURL: string, shortURL: string, expire: string): void {
    if (!this.sessionService.isAuthed()) {
      this.messageService.newMessage('You must sign in to create custom URL.');
      return;
    }
    // var URLobj = {...arguments, account_id: }
  }


  constructor(
    private messageService: MessageService,
    private sessionService: SessionService
  ) { }
}
