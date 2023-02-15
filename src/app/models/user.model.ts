import { Role } from './types/role.type';

export interface User {
  name: string;
  email: string;
  google: boolean;
  img: string;
  role: Role;
  uid?: string;
  password?: string;
}
