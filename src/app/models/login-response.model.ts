import { MenuItem } from './menu-item.model';
import { StandardResponse } from './standard-response.model';

export interface LoginResponse extends StandardResponse {
  token: string;
  menu: MenuItem[];
}
