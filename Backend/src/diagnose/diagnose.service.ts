// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Diagnose, DiagnoseDocument } from './entities/diagnose.entity';
// import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
// import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';

// @Injectable()
// export class DiagnoseService {
//   constructor(
//     @InjectModel(Diagnose.name)
//     private diagnoseModel: Model<DiagnoseDocument>,
//   ) {}

//   async create(createDiagnoseDto: CreateDiagnoseDto): Promise<Diagnose> {
//     const createdDiagnose = new this.diagnoseModel(createDiagnoseDto);
//     return createdDiagnose.save();
//   }

//   async findAll(): Promise<Diagnose[]> {
//     return this.diagnoseModel.find().exec();
//   }
//   async findOne(id: string): Promise<Diagnose> {
//     return this.diagnoseModel.findById(id).exec();
//   }

//   async update(
//     id: string,
//     updateDiagnoseDto: UpdateDiagnoseDto,
//   ): Promise<Diagnose> {
//     return this.diagnoseModel
//       .findByIdAndUpdate(id, updateDiagnoseDto, { new: true })
//       .exec();
//   }

//   async remove(id: string): Promise<Diagnose> {
//     return this.diagnoseModel.findByIdAndDelete(id).exec();
//   }
// }
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Diagnose, DiagnoseDocument } from './entities/diagnose.entity';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';

@Injectable()
export class DiagnoseService {
  constructor(
    @InjectModel(Diagnose.name) private diagnoseModel: Model<DiagnoseDocument>,
  ) {}  async create(createDiagnoseDto: CreateDiagnoseDto) {
    const created = new this.diagnoseModel({
      ...createDiagnoseDto,
      createdAt: new Date(),
    });
    return created.save();
  }

  async findAll() {
    return this.diagnoseModel.find({ deleted: false });
  }

  async findOne(diagnose_id: string) {
    return this.diagnoseModel.findOne({ diagnose_id, deleted: false });
  }

  async update(diagnose_id: string, updateDiagnoseDto: UpdateDiagnoseDto) {
    return this.diagnoseModel.findOneAndUpdate(
      { diagnose_id },
      updateDiagnoseDto,
      { new: true },
    );
  }

  async remove(diagnose_id: string) {
    // Soft delete
    return this.diagnoseModel.findOneAndUpdate(
      { diagnose_id },
      { deleted: true },
      { new: true },
    );
  }

  async getNextDiagnoseId(): Promise<string> {
    const prefix = "DGN";
    const diagnoses = await this.diagnoseModel.find({ deleted: false }).exec();
    
    const usedNumbers = diagnoses
      .map(d => d.diagnose_id)
      .filter(id => id && id.startsWith(prefix))
      .map(id => parseInt(id.replace(prefix, ""), 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    let nextNum = 1;
    for (let num of usedNumbers) {
      if (num === nextNum) nextNum++;
      else break;
    }
    
    return prefix + nextNum.toString().padStart(4, "0");
  }
}