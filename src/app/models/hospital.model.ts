interface HospitalUser {
  _id: string;
  name: string;
  img: string;
}

export interface Hospital {
  name: string;
  _id?: string;
  img?: string;
  user?: HospitalUser;
}
