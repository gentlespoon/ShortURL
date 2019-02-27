export class UrlPair {
  shortURL: string = '';
  longURL: string = '';
  title: string = '';

  constructor(UPobj: object) {
    this.shortURL = UPobj['shortURL'] ? UPobj['shortURL'] : '';
    this.longURL = UPobj['longURL'] ? UPobj['longURL'] : '';
    this.title = UPobj['title'] ? UPobj['title'] : '';
  }

}
