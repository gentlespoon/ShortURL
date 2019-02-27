import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-spam',
  templateUrl: './report-spam.component.html',
  styleUrls: ['../static.component.css']
})
export class ReportSpamComponent implements OnInit {

  public focus = {};
  shortURL: string = '';

  constructor() {
  }

  ngOnInit() {
  }

  report() {

  }


  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    this.focus[name] = false;
  }

}
