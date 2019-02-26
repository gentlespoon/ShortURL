import { Component, OnInit } from '@angular/core';

import { MessageService } from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor(
    public messageService: MessageService
  ) { }

  alertDetail(msg: string): void {
    window.alert(msg);
  }

  dismiss(index: number): void {
    this.messageService.dismiss(index);
  }

  ngOnInit() {
  }

}
