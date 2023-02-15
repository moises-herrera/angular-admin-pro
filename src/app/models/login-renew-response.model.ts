import { MenuItem, StandardResponse, User } from '.';

export interface LoginRenewResponse extends StandardResponse {
  token: string;
  menu: MenuItem[];
  user: User;
}
