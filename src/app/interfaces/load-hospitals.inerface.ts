import { Hospital } from "../models/hospital.model";

export interface LoadHospitals {
  ok: boolean;
  hospitals: Hospital[];
}
