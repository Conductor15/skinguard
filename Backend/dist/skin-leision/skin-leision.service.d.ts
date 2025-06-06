import { Model } from 'mongoose';
import { SkinLesion, SkinLesionDocument } from './entities/skin-leision.entity';
import { CreateSkinLesionDto } from './dto/create-skin-leision.dto';
import { UpdateSkinLeisionDto } from './dto/update-skin-leision.dto';
export declare class SkinLesionService {
    private skinLesionModel;
    constructor(skinLesionModel: Model<SkinLesionDocument>);
    create(createSkinLesionDto: CreateSkinLesionDto): Promise<SkinLesion>;
    findAll(): Promise<SkinLesion[]>;
    findOne(id: string): Promise<SkinLesion>;
    update(id: string, updateSkinLesionDto: UpdateSkinLeisionDto): Promise<SkinLesion>;
    remove(id: string): Promise<SkinLesion>;
}
