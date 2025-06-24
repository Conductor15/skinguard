import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DiagnoseService } from './diagnose.service';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';

@Controller('diagnose')
export class DiagnoseController {
  constructor(private readonly diagnoseService: DiagnoseService) {}

  @Post()
  create(@Body() createDiagnoseDto: CreateDiagnoseDto) {
    return this.diagnoseService.create(createDiagnoseDto);
  }

  @Get()
  findAll() {
    return this.diagnoseService.findAll();
  }
  // Endpoint to get the next diagnose ID
  // This is useful for generating unique IDs before creating a new diagnose
  @Get('next-id')
  getNextId() {
    return this.diagnoseService.getNextDiagnoseId();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnoseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiagnoseDto: UpdateDiagnoseDto,
  ) {
    return this.diagnoseService.update(id, updateDiagnoseDto);
  }  // endpoint for soft delete
  @Delete(':diagnose_id')
  remove(@Param('diagnose_id') diagnose_id: string) {
    return this.diagnoseService.remove(diagnose_id);
  }

  // endpoint for hard delete
  @Delete(':diagnose_id/hard')
  hardRemove(@Param('diagnose_id') diagnose_id: string) {
    return this.diagnoseService.hardDelete(diagnose_id);
  }

  // endpoint for restore soft deleted diagnose
  @Patch(':diagnose_id/restore')
  restore(@Param('diagnose_id') diagnose_id: string) {
    return this.diagnoseService.restore(diagnose_id);
  }
}
