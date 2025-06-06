import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultDto } from './create-consult.dto';

export class UpdateConsultDto extends PartialType(CreateConsultDto) {}
