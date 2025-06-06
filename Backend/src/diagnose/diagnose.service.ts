import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DiagnoseList, DiagnoseListDocument } from './entities/diagnose.entity';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';

@Injectable()
export class DiagnoseService {
  constructor(
    @InjectModel(DiagnoseList.name)
    private diagnoseModel: Model<DiagnoseListDocument>,
  ) {}

  async create(createDiagnoseDto: CreateDiagnoseDto): Promise<DiagnoseList> {
    const createdDiagnose = new this.diagnoseModel(createDiagnoseDto);
    return createdDiagnose.save();
  }

  async findAll(): Promise<DiagnoseList[]> {
    return this.diagnoseModel.find().exec();
  }

  async findOne(id: string): Promise<DiagnoseList> {
    return this.diagnoseModel.findById(id).exec();
  }

  async update(
    id: string,
    updateDiagnoseDto: UpdateDiagnoseDto,
  ): Promise<DiagnoseList> {
    return this.diagnoseModel
      .findByIdAndUpdate(id, updateDiagnoseDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<DiagnoseList> {
    return this.diagnoseModel.findByIdAndDelete(id).exec();
  }
}
