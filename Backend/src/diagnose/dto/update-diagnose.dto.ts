import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagnoseDto } from './create-diagnose.dto';

export class UpdateDiagnoseDto extends PartialType(CreateDiagnoseDto) {}
