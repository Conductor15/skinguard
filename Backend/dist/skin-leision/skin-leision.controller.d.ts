import { SkinLesionService } from './skin-leision.service';
import { CreateSkinLesionDto } from './dto/create-skin-leision.dto';
import { UpdateSkinLeisionDto } from './dto/update-skin-leision.dto';
export declare class SkinLesionController {
    private readonly skinLesionService;
    constructor(skinLesionService: SkinLesionService);
    create(createSkinLesionDto: CreateSkinLesionDto): Promise<import("./entities/skin-leision.entity").SkinLesion>;
    findAll(): Promise<import("./entities/skin-leision.entity").SkinLesion[]>;
    findOne(id: string): Promise<import("./entities/skin-leision.entity").SkinLesion>;
    update(id: string, updateSkinLesionDto: UpdateSkinLeisionDto): Promise<import("./entities/skin-leision.entity").SkinLesion>;
    remove(id: string): Promise<import("./entities/skin-leision.entity").SkinLesion>;
}
