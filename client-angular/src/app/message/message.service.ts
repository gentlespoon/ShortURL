import { Injectable } from '@angular/core';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public messages: Message[];
  private cron: any;

  /**
   * Push a new message into messages list
   * @param message String: Message
   * @param timeout Number: Timeout in milliseconds
   * @param style String: CSS class names
   * @param dismissible Boolean: User dismissible
   * @param detail String: Detailed message
   */
  public newMessage(
    message: string, timeout?: number | boolean,
    style?: string, dismissible?: boolean, detail?: string
  ) {
    // console.log(this.messages);
    var msgObj = {};
    if (!message) throw ('Empty message body');
    msgObj['message'] = message;
    switch (typeof timeout) {
      // if timeout===true, set timeout to default 15s.
      // if timeout===false, set timeout to -1 to disable countdown.
      case 'boolean': timeout ? 15 : -1;
      // if number, use the provided value
      case 'number': break;
      // otherwise, set to default 15s;
      default: timeout = 15;
    }
    msgObj['timeout'] = timeout;
    msgObj['style'] = style ? style : 'alert-primary';
    msgObj['dismissible'] = typeof dismissible === 'undefined' ? true : false;
    msgObj['detail'] = detail ? detail : '';

    this.messages.push(new Message(msgObj));

  }

  private timerTick(): void {
    // console.log(this.messages);
    if (this.messages.length) {
      // reverse direction so deleting message does not affect previous indices.
      for (var msgIndex = this.messages.length-1; msgIndex >= 0; msgIndex--) {
        if (this.messages[msgIndex].timerTick()) {
          this.messages.splice(msgIndex, 1);
        }
      }
    }
  }

  public dismiss(index: number) {
    this.messages.splice(index, 1);
  }

  constructor() {
    this.messages = [];
    this.cron = setInterval(() => { this.timerTick(); }, 1000);
  }
}
