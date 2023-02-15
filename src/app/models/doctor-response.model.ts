import { Doctor, StandardResponse } from '.';

export interface DoctorResponse extends StandardResponse {
  doctor: Doctor;
}
