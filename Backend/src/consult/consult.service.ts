import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consult, ConsultDocument } from './entities/consult.entity';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';

@Injectable()
export class ConsultService {
  constructor(
    @InjectModel(Consult.name)
    private consultModel: Model<ConsultDocument>,
  ) {}

  async create(createConsultDto: CreateConsultDto): Promise<Consult> {
    const createdConsult = new this.consultModel(createConsultDto);
    return createdConsult.save();
  }

  async findAll(): Promise<Consult[]> {
    return this.consultModel.find().populate('patient_id').exec();
  }
  async findOne(id: string): Promise<Consult> {
    return this.consultModel.findById(id).populate('patient_id').exec();
  }

  async update(
    id: string,
    updateConsultDto: UpdateConsultDto,
  ): Promise<Consult> {
    return this.consultModel
      .findByIdAndUpdate(id, updateConsultDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Consult> {
    return this.consultModel.findByIdAndDelete(id).exec();
  }
}
