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

@Controller('skin-leision')
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

  @Post('bulk')
  async createMany(@Body() createSkinLesionDtos: CreateSkinLesionDto[]) {
    return this.skinLesionService.createMany(createSkinLesionDtos);
  }

  @Patch(':name')
  async updateRelatedProducts(
    @Param('name') name: string,
    @Body('relatedProducts') relatedProducts: string[],
  ) {
    return this.skinLesionService.updateRelatedProductsByName(
      name,
      relatedProducts,
    );
  }

  @Get(':name')
  async findByName(@Param('name') name: string) {
    return this.skinLesionService.findByName(name);
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
