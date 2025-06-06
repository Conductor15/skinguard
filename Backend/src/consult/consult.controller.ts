import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsultService } from './consult.service';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';

@Controller('consult')
export class ConsultController {
  constructor(private readonly consultService: ConsultService) {}

  @Post()
  create(@Body() createConsultDto: CreateConsultDto) {
    return this.consultService.create(createConsultDto);
  }

  @Get()
  findAll() {
    return this.consultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultDto: UpdateConsultDto) {
    return this.consultService.update(id, updateConsultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultService.remove(id);
  }
}
