import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }

  // Thêm diagnose cho patient //
  @Patch(':id/add-diagnose')
  addDiagnose(@Param('id') id: string, @Body('diagnoseId') diagnoseId: string) {
    return this.patientService.addDiagnoseToPatient(id, diagnoseId);
  }

  // Xoá diagnose khỏi patient //
  @Patch(':id/remove-diagnose')
  removeDiagnose(@Param('id') id: string, @Body('diagnoseId') diagnoseId: string) {
    return this.patientService.removeDiagnoseFromPatient(id, diagnoseId);
  }
}