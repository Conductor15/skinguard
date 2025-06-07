import { ConsultService } from './consult.service';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';
export declare class ConsultController {
    private readonly consultService;
    constructor(consultService: ConsultService);
    create(createConsultDto: CreateConsultDto): Promise<import("./entities/consult.entity").ConsultList>;
    findAll(): Promise<import("./entities/consult.entity").ConsultList[]>;
    findOne(id: string): Promise<import("./entities/consult.entity").ConsultList>;
    update(id: string, updateConsultDto: UpdateConsultDto): Promise<import("./entities/consult.entity").ConsultList>;
    remove(id: string): Promise<import("./entities/consult.entity").ConsultList>;
}
