import { Doctor, Hospital, StandardResponse, User } from '.';

export interface CollectionSearchResponse extends StandardResponse {
  results: User[] | Hospital[] | Doctor[];
}
