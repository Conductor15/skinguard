import { ConsultService } from './consult.service';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';
export declare class ConsultController {
    private readonly consultService;
    constructor(consultService: ConsultService);
    create(createConsultDto: CreateConsultDto): Promise<import("./entities/consult.entity").Consult>;
    findAll(): Promise<import("./entities/consult.entity").Consult[]>;
    findOne(id: string): Promise<import("./entities/consult.entity").Consult>;
    update(id: string, updateConsultDto: UpdateConsultDto): Promise<import("./entities/consult.entity").Consult>;
    remove(id: string): Promise<import("./entities/consult.entity").Consult>;
}
