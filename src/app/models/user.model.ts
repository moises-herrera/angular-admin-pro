import { environment } from 'src/environments/environment';
import { Role } from '../interfaces/types/role.type';

const base_url = environment.base_url;

export class User {
  constructor(
    public name: string,
    public email: string,
    public google: boolean,
    public img: string,
    public role: Role,
    public uid?: string,
    public password?: string
  ) {}

  get imageUrl(): string {
    if (this.img?.includes('https')) return this.img;

    if (this.img) {
      return `${base_url}/upload/users/${this.img}`;
    }

    return `${base_url}/upload/users/no-image`;
  }
}
