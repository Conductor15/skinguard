import { Model } from 'mongoose';
import { ConsultList, ConsultListDocument } from './entities/consult.entity';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';
export declare class ConsultService {
    private consultModel;
    constructor(consultModel: Model<ConsultListDocument>);
    create(createConsultDto: CreateConsultDto): Promise<ConsultList>;
    findAll(): Promise<ConsultList[]>;
    findOne(id: string): Promise<ConsultList>;
    update(id: string, updateConsultDto: UpdateConsultDto): Promise<ConsultList>;
    remove(id: string): Promise<ConsultList>;
}
