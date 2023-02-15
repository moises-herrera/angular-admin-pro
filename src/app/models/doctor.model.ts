import { Hospital } from './hospital.model';

interface DoctorUser {
  _id: string;
  name: string;
  img: string;
}

export interface Doctor {
  name: string;
  _id?: string;
  img?: string;
  user?: DoctorUser;
  hospital?: Hospital;
}
