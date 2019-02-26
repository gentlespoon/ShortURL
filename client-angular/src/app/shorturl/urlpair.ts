interface _UrlPair {
  id: string;
  shortURL: string;
  longURL: string;
}

export class UrlPair implements _UrlPair {
  private _id: string = '';
  private _shortURL: string = '';
  private _longURL: string = '';

  constructor(UPobj: object) {
    this._id = UPobj['id'] ? UPobj['id'] : 'new';
    this._shortURL = UPobj['shortURL'] ? UPobj['shortURL'] : '';
    this._longURL = UPobj['longURL'] ? UPobj['longURL'] : '';
  }

  public get shortURL(): string {
    return this._shortURL;
  }
  public set shortURL(value: string) {
    this._shortURL = value;
  }

  public get longURL(): string {
    return this._longURL;
  }
  public set longURL(value: string) {
    this._longURL = value;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

}
