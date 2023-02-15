import { Doctor, StandardResponse } from '.';

export interface LoadDoctorsResponse extends StandardResponse {
  doctors: Doctor[];
}
