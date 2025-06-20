// export class CreateDoctorDto {
//   doctor_id: string;
//   password: string;
//   fullName: string;
//   discipline: string;
//   rating?: number;
//   avatar?: string;
//   permission: string;
//   email: string;
//   phoneNumber: string;
// }
export class CreateDoctorDto {
  doctor_id: string;
  password: string;
  fullName: string;
  specialty: string;          
  bio?: string;
  rating?: number;
  avatar?: string;
  email: string;
  phone: string;            
  status?: string;
  experienceYears?: number;
}