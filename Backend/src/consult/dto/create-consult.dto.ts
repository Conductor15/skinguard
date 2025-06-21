// export class CreateConsultDto {
//   consult_id: string;
//   date: Date;
//   patient_id: string;
//   patient_description: string;
//   result: string;
// }
export class CreateConsultDto {
  consult_id: string;
  date: Date;
  doctor_id: string;    // ObjectId string
  patient_id: string;   // ObjectId string
  patient_description: string;
  result: string;
}