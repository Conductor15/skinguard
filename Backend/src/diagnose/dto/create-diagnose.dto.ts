export class CreateDiagnoseDto {
  diagnose_list_id: string;
  lesion_type: string;
  date: Date;
  image?: string;
  accuracy?: number;
  rating?: number;
}