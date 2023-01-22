export class User {
  constructor(
    public name: string,
    public email: string,
    public google: boolean,
    public img: string,
    public password?: string,
    public role?: string,
    public uid?: string
  ) {}
}
