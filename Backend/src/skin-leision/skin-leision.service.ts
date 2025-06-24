import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkinLesion, SkinLesionDocument } from './entities/skin-leision.entity';
import { CreateSkinLesionDto } from './dto/create-skin-leision.dto';
import { UpdateSkinLeisionDto } from './dto/update-skin-leision.dto';
import { Product, ProductDocument } from '../product/entities/product.entity';

@Injectable()
export class SkinLesionService {
  constructor(
    @InjectModel(SkinLesion.name)
    private skinLesionModel: Model<SkinLesionDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(createSkinLesionDto: CreateSkinLesionDto): Promise<SkinLesion> {
    const createdSkinLesion = new this.skinLesionModel(createSkinLesionDto);
    return createdSkinLesion.save();
  }
  async findAll(): Promise<SkinLesion[]> {
    return this.skinLesionModel.find().populate('relatedProducts').exec();
  }

  async findOne(id: string): Promise<SkinLesion> {
    return this.skinLesionModel.findById(id).populate('relatedProducts').exec();
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

  async addProductToSkinLesion(
    skinLesionId: string,
    productId: string,
  ): Promise<SkinLesion> {
    // Tìm product bằng product_id field
    const product = await this.productModel
      .findOne({ product_id: productId })
      .exec();
    if (!product) {
      throw new Error(`Product with product_id ${productId} not found`);
    }
    // Thêm ObjectId của product vào skin lesion
    return this.skinLesionModel
      .findByIdAndUpdate(
        skinLesionId,
        { $addToSet: { relatedProducts: product._id } },
        { new: true },
      )
      .populate('relatedProducts')
      .exec();
  }

  async removeProductFromSkinLesion(
    skinLesionId: string,
    productId: string,
  ): Promise<SkinLesion> {
    // Tìm product bằng product_id field
    const product = await this.productModel
      .findOne({ product_id: productId })
      .exec();
    if (!product) {
      throw new Error(`Product with product_id ${productId} not found`);
    }
    // Xóa ObjectId của product khỏi skin lesion
    return this.skinLesionModel
      .findByIdAndUpdate(
        skinLesionId,
        { $pull: { relatedProducts: product._id } },
        { new: true },
      )
      .populate('relatedProducts')
      .exec();
  }
  // Method để lấy chỉ những field cần thiết cho display
  async findAllForDisplay(): Promise<SkinLesion[]> {
    return this.skinLesionModel
      .find()
      .populate('relatedProducts', 'title price image availability')
      .exec();
  }

  // Method để lấy full data cho admin/doctor
  async findAllForAdmin(): Promise<SkinLesion[]> {
    return this.skinLesionModel
      .find()
      .populate('relatedProducts') // Full populate
      .exec();
  }
}
