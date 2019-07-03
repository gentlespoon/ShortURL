nodeMailer = require('nodemailer');

class Email {

  constructor() {
    this.mailer = nodeMailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
      }
    });
  }

  validate(email) {
    // console.log('checking email format');
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }


  send(mail) {
    mail.html = mail.html.split('{{email}}').join(mail.to);
    setTimeout( () => {
      this.mailer.sendMail(mail, (err, info) => {
        if (err) return console.log('Failed to send mail to ' + mail.to, err, info);
        console.log('Mail sent to ' + mail.to);
      });
    }, 1000);
  };


  // email templates
  template(t) {
    var body = `<div style="background-color: #006088; color: white; padding: 1em; font-size: 1.2em; font-weight: 600;">Gs-ShortURL</div>`;
    switch (t) {
      case 'register':
        body += `
<p>Although I do not understand why you choose my service, but anyway, thanks for registering!</p>
<p>You may create custom short URLs now.</p>
<p><a href="https://gtspn.com/" target="_blank" style="
  text-decoration: none;
  padding: .5em;
  border-radius: .25em;
  color: white;
  font-weight: 600;
  box-shadow: 1px 1px 1px black;
  background-color: #006088;
">Create a custom Short URL!</a></p>
`;
        break;
      case 'forget':
        body += `
<p>People always forget their password. Just follow the link to reset your password.</p>
<p><a href="https://gtspn.com/user/reset/{{token}}" target="_blank">https://gtspn.com/user/reset/{{token}}</a></p>
<p>If you did not request to change your password, please disregard this email.<br>Your password is still safe and will not be changed.</p>
`;
    }
    body += `<div style="margin-top: 2em; font-size: 0.8em">This email is intended for {{email}}.</div>`;
    return body;
  }

};

module.exports = new Email();
