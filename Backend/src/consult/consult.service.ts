import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsultList, ConsultListDocument } from './entities/consult.entity';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';

@Injectable()
export class ConsultService {
  constructor(
    @InjectModel(ConsultList.name)
    private consultModel: Model<ConsultListDocument>,
  ) {}

  async create(createConsultDto: CreateConsultDto): Promise<ConsultList> {
    const createdConsult = new this.consultModel(createConsultDto);
    return createdConsult.save();
  }

  async findAll(): Promise<ConsultList[]> {
    return this.consultModel.find().populate('patient_id').exec();
  }

  async findOne(id: string): Promise<ConsultList> {
    return this.consultModel.findById(id).populate('patient_id').exec();
  }

  async update(
    id: string,
    updateConsultDto: UpdateConsultDto,
  ): Promise<ConsultList> {
    return this.consultModel
      .findByIdAndUpdate(id, updateConsultDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ConsultList> {
    return this.consultModel.findByIdAndDelete(id).exec();
  }
}
