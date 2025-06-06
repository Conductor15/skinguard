import { PartialType } from '@nestjs/mapped-types';
import { CreateSkinLesionDto } from './create-skin-leision.dto';

export class UpdateSkinLeisionDto extends PartialType(CreateSkinLesionDto) {}
