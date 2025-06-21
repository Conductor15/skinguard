// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Consult, ConsultDocument } from './entities/consult.entity';
// import { CreateConsultDto } from './dto/create-consult.dto';
// import { UpdateConsultDto } from './dto/update-consult.dto';

// @Injectable()
// export class ConsultService {
//   constructor(
//     @InjectModel(Consult.name)
//     private consultModel: Model<ConsultDocument>,
//   ) {}

//   async create(createConsultDto: CreateConsultDto): Promise<Consult> {
//     const createdConsult = new this.consultModel(createConsultDto);
//     return createdConsult.save();
//   }

//   async findAll(): Promise<Consult[]> {
//     return this.consultModel.find().populate('patient_id').exec();
//   }
//   async findOne(id: string): Promise<Consult> {
//     return this.consultModel.findById(id).populate('patient_id').exec();
//   }

//   async update(
//     id: string,
//     updateConsultDto: UpdateConsultDto,
//   ): Promise<Consult> {
//     return this.consultModel
//       .findByIdAndUpdate(id, updateConsultDto, { new: true })
//       .exec();
//   }

//   async remove(id: string): Promise<Consult> {
//     return this.consultModel.findByIdAndDelete(id).exec();
//   }
// }
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Consult, ConsultDocument } from './entities/consult.entity';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';
import { Doctor, DoctorDocument } from '../doctor/entities/doctor.entity';

@Injectable()
export class ConsultService {
  constructor(
    @InjectModel(Consult.name)
    private consultModel: Model<ConsultDocument>,
    @InjectModel(Doctor.name)
    private doctorModel: Model<DoctorDocument>,
  ) {}

  async create(createConsultDto: CreateConsultDto): Promise<Consult> {
    // Tạo consult mới
    const createdConsult = new this.consultModel({
      ...createConsultDto,
      doctor_id: new Types.ObjectId(createConsultDto.doctor_id),
      patient_id: new Types.ObjectId(createConsultDto.patient_id),
    });
    const result = await createdConsult.save();

    // Thêm consult vào consult_list_id của doctor
    await this.doctorModel.findOneAndUpdate(
      { _id: createConsultDto.doctor_id },
      { $addToSet: { consult_list_id: result._id } }
    );

    return result;
  }

  async findAll(): Promise<Consult[]> {
    return this.consultModel
      .find()
      .populate('doctor_id', 'fullName')
      .populate('patient_id', 'fullName')
      .exec();
  }

  async findOne(id: string): Promise<Consult | null> {
    return this.consultModel
      .findById(id)
      .populate('doctor_id', 'fullName')
      .populate('patient_id', 'fullName')
      .exec();
  }

  async update(
    id: string,
    updateConsultDto: UpdateConsultDto,
  ): Promise<Consult | null> {
    return this.consultModel
      .findByIdAndUpdate(id, updateConsultDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Consult | null> {
    // Xoá consult khỏi consult_list_id của Doctor trước khi xóa consult
    const consult = await this.consultModel.findById(id).exec();
    if (consult && consult.doctor_id) {
      await this.doctorModel.findOneAndUpdate(
        { _id: consult.doctor_id },
        { $pull: { consult_list_id: consult._id } }
      );
    }
    return this.consultModel.findByIdAndDelete(id).exec();
  }
}