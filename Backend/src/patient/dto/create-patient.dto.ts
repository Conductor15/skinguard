export class CreatePatientDto {
  patient_id: string;
  email: string;
  password: string;
  fullName: string;
  birthDay: Date;
  phone?: string;
  avatar?: string;
  orderID?: string;
}