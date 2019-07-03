import * as moment from 'moment';


export class UrlPair {
  short_url: string = '';
  long_url: string = '';
  title: string = '';
  expire: string = '';
  create_date: string = '';
  clicks: number = 0;
  history: any[] = [];

  constructor(UPobj: object) {
    this.short_url = UPobj['short_url'] ? UPobj['short_url'] : '';
    this.long_url = UPobj['long_url'] ? UPobj['long_url'] : '';
    this.title = UPobj['title'] ? UPobj['title'] : '';
    this.expire = UPobj['expire'] ? UPobj['expire'] : moment().add(1, 'year').toISOString();
    this.create_date = UPobj['create_date'] ? UPobj['create_date'] : moment().toISOString();
    this.clicks = UPobj['clicks'] ? UPobj['clicks'] : 0;
    this.history = [];
    if (typeof UPobj['history'] === 'object' && UPobj['history'].length) {
      for (let hist of UPobj['history']) {
        this.history.push(hist);
      }
    }
  }

}
