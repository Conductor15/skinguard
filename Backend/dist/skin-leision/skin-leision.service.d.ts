import { Model } from 'mongoose';
import { SkinLesion, SkinLesionDocument } from './entities/skin-leision.entity';
import { CreateSkinLesionDto } from './dto/create-skin-leision.dto';
import { UpdateSkinLeisionDto } from './dto/update-skin-leision.dto';
import { ProductDocument } from '../product/entities/product.entity';
export declare class SkinLesionService {
    private skinLesionModel;
    private productModel;
    constructor(skinLesionModel: Model<SkinLesionDocument>, productModel: Model<ProductDocument>);
    create(createSkinLesionDto: CreateSkinLesionDto): Promise<SkinLesion>;
    findAll(): Promise<SkinLesion[]>;
    findOne(id: string): Promise<SkinLesion>;
    update(id: string, updateSkinLesionDto: UpdateSkinLeisionDto): Promise<SkinLesion>;
    remove(id: string): Promise<SkinLesion>;
    addProductToSkinLesion(skinLesionId: string, productId: string): Promise<SkinLesion>;
    removeProductFromSkinLesion(skinLesionId: string, productId: string): Promise<SkinLesion>;
    findAllForDisplay(): Promise<SkinLesion[]>;
    findAllForAdmin(): Promise<SkinLesion[]>;
}
