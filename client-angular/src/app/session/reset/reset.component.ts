import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'src/app/message/message.service';
import { SessionService } from '../session.service';
import { EmailService } from 'src/app/shorturl/email.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  token: string = '';
  password: string = '';
  passwordVerify: string = '';
  public focus = {};

  constructor(
    private route: ActivatedRoute,
    public messageService: MessageService,
    private sessionService: SessionService,
    private _router: Router,
  ) { }

  ngOnInit() {
    // verify token
    this.token = this.route.snapshot.paramMap.get("token");
    this.sessionService.checkToken(this.token).subscribe(response => {
      if (response.result) {
        // this.messageService.newMessage(response.data);
      } else {
        // redirect if token invalid
        this.messageService.newMessage(response.data, null, 'alert-danger');
        this._router.navigate(['/user/forget']);
      }
    });
  }

  reset() {
    if (!this.password || !this.passwordVerify) {
      this.messageService.newMessage('Enter your new password.');
      return;
    }
    if (this.password !== this.passwordVerify) {
      this.messageService.newMessage('Passwords do not match.', null, 'alert-danger');
    }
    var invalidPassword = this.sessionService.checkPasswordStrenth(this.password);
    if (invalidPassword) {
      this.messageService.newMessage(invalidPassword, null, 'alert-danger');
      return;
    }
    this.sessionService.reset(this.token, this.password).subscribe(response => {
      if (response.result) {
        this.messageService.newMessage(response.data);
        this._router.navigate(['/user/signin']);
      } else {
        this.messageService.newMessage(response.data, null, 'alert-danger');
        this._router.navigate(['/user/forget']);
      }
    })
  }

  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    this.focus[name] = false;
  }

}
// http://localhost:4200/user/reset/4d6a10ce-2a9e-4d82-8667-19b506ccc4e4