export class UrlPair {
  short_url: string = '';
  long_url: string = '';
  title: string = '';
  expire: string = '';
  clicks: number = 0;

  constructor(UPobj: object) {
    this.short_url = UPobj['short_url'] ? UPobj['short_url'] : '';
    this.long_url = UPobj['long_url'] ? UPobj['long_url'] : '';
    this.title = UPobj['title'] ? UPobj['title'] : '';
    this.expire = UPobj['expire'] ? UPobj['expire'] : '';
    this.clicks = UPobj['clicks'] ? UPobj['clicks'] : 0;
  }

}
