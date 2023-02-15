import { Doctor, Hospital, StandardResponse, User } from '.';

export interface GlobalSearchResponse extends StandardResponse {
  users: User[];
  doctors: Doctor[];
  hospitals: Hospital[];
}
