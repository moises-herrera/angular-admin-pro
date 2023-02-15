import { StandardResponse, User } from '.';

export interface LoadUsersResponse extends StandardResponse {
  total: number;
  users: User[];
}
