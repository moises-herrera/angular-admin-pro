import { Hospital, StandardResponse } from '.';

export interface HospitalResponse extends StandardResponse {
  hospital: Hospital;
}
