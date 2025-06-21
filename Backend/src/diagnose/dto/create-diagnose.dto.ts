// export class CreateDiagnoseDto {
//   diagnose_list_id: string;
//   lesion_type: string;
//   date: Date;
//   image?: string;
//   accuracy?: number;
//   rating?: number;
// }
export class CreateDiagnoseDto {
  diagnose_id: string;
  prediction: string;
  image?: string;
  description?: string;
  confidence?: number;
  createdBy: string; // patient_id
}