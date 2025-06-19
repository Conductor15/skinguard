import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Diagnose, DiagnoseDocument } from './entities/diagnose.entity';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';

@Injectable()
export class DiagnoseService {
  constructor(
    @InjectModel(Diagnose.name)
    private diagnoseModel: Model<DiagnoseDocument>,
  ) {}

  async create(createDiagnoseDto: CreateDiagnoseDto): Promise<Diagnose> {
    const createdDiagnose = new this.diagnoseModel(createDiagnoseDto);
    return createdDiagnose.save();
  }

  async findAll(): Promise<Diagnose[]> {
    return this.diagnoseModel.find().exec();
  }
  async findOne(id: string): Promise<Diagnose> {
    return this.diagnoseModel.findById(id).exec();
  }

  async update(
    id: string,
    updateDiagnoseDto: UpdateDiagnoseDto,
  ): Promise<Diagnose> {
    return this.diagnoseModel
      .findByIdAndUpdate(id, updateDiagnoseDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Diagnose> {
    return this.diagnoseModel.findByIdAndDelete(id).exec();
  }
}
