import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SkinLesionService } from './skin-leision.service';
import { CreateSkinLesionDto } from './dto/create-skin-leision.dto';
import { UpdateSkinLeisionDto } from './dto/update-skin-leision.dto';

@Controller('skin-lesion')
export class SkinLesionController {
  constructor(private readonly skinLesionService: SkinLesionService) {}

  @Post()
  create(@Body() createSkinLesionDto: CreateSkinLesionDto) {
    return this.skinLesionService.create(createSkinLesionDto);
  }

  @Get()
  findAll() {
    return this.skinLesionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skinLesionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkinLesionDto: UpdateSkinLeisionDto,
  ) {
    return this.skinLesionService.update(id, updateSkinLesionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skinLesionService.remove(id);
  }
}
