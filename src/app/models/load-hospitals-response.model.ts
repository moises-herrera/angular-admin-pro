import { Hospital, StandardResponse } from '.';

export interface LoadHospitalsResponse extends StandardResponse {
  hospitals: Hospital[];
}
