import { Model } from 'mongoose';
import { Consult, ConsultDocument } from './entities/consult.entity';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';
export declare class ConsultService {
    private consultModel;
    constructor(consultModel: Model<ConsultDocument>);
    create(createConsultDto: CreateConsultDto): Promise<Consult>;
    findAll(): Promise<Consult[]>;
    findOne(id: string): Promise<Consult>;
    update(id: string, updateConsultDto: UpdateConsultDto): Promise<Consult>;
    remove(id: string): Promise<Consult>;
}
