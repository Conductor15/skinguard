import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkinLesion, SkinLesionDocument } from './entities/skin-leision.entity';
import { CreateSkinLesionDto } from './dto/create-skin-leision.dto';
import { UpdateSkinLeisionDto } from './dto/update-skin-leision.dto';

@Injectable()
export class SkinLesionService {
  constructor(
    @InjectModel(SkinLesion.name)
    private skinLesionModel: Model<SkinLesionDocument>,
  ) {}

  async create(createSkinLesionDto: CreateSkinLesionDto): Promise<SkinLesion> {
    const createdSkinLesion = new this.skinLesionModel(createSkinLesionDto);
    return createdSkinLesion.save();
  }

  async findAll(): Promise<SkinLesion[]> {
    return this.skinLesionModel.find().exec();
  }

  async findOne(id: string): Promise<SkinLesion> {
    return this.skinLesionModel.findById(id).exec();
  }

  async update(
    id: string,
    updateSkinLesionDto: UpdateSkinLeisionDto,
  ): Promise<SkinLesion> {
    return this.skinLesionModel
      .findByIdAndUpdate(id, updateSkinLesionDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<SkinLesion> {
    return this.skinLesionModel.findByIdAndDelete(id).exec();
  }
}
