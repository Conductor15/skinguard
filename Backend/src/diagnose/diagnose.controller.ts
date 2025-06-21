// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { DiagnoseService } from './diagnose.service';
// import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
// import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';

// @Controller('diagnose')
// export class DiagnoseController {
//   constructor(private readonly diagnoseService: DiagnoseService) {}

//   @Post()
//   create(@Body() createDiagnoseDto: CreateDiagnoseDto) {
//     return this.diagnoseService.create(createDiagnoseDto);
//   }

//   @Get()
//   findAll() {
//     return this.diagnoseService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.diagnoseService.findOne(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateDiagnoseDto: UpdateDiagnoseDto,
//   ) {
//     return this.diagnoseService.update(id, updateDiagnoseDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.diagnoseService.remove(id);
//   }
// }
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnoseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiagnoseDto: UpdateDiagnoseDto) {
    return this.diagnoseService.update(id, updateDiagnoseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagnoseService.remove(id);
  }
}