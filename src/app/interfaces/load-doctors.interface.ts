import { Doctor } from '../models/doctor.model';

export interface LoadDoctors {
  ok: boolean;
  doctors: Doctor[];
}
