interface Msg {
  timeout: number;
  message: string;
  style: string;
  dismissible: boolean;
  detail: string;
}

export class Message implements Msg {
  private _timeout: number;
  private _msg: string;
  private _detail: string;
  private _style: string;
  private _dismissible: boolean;

  constructor(MsgObj: object) {
    this._timeout = !MsgObj['timeout'] ? -1 : MsgObj['timeout'] * 1000;
    this._msg = MsgObj['message'];
    this._style = MsgObj['style'];
    // if auto dismiss is disabled, user must be able to manually dismiss the alert
    this._dismissible = this._timeout === -1 ? true : MsgObj['dismissible'];
    this._detail = MsgObj['detail'];
  }

  /**
   * Return: true for destruct, false for continue displaying
   */
  public timerTick(): boolean {
    if (this._timeout > 0) {
      this._timeout-=1000;
      if (this._timeout == 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * value: Number, in seconds
   */
  public set timeout(value: number) {
    this._timeout = value * 1000;
  }
  public get timeout(): number {
    return this._timeout / 1000;
  }

  public set message(value: string) {
    this._msg = value;
  }
  public get message(): string {
    return this._msg;
  }

  public set style(value: string) {
    this._style = value;
  }
  public get style(): string {
    return this._style;
  }

  public set dismissible(value: boolean) {
    this._dismissible = value;
  }
  public get dismissible(): boolean {
    return this._dismissible;
  }

  public set detail(value: string) {
    this._detail = value;
  }
  public get detail(): string {
    return this._detail;
  }


}
