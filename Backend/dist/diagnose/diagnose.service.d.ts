import { Model } from 'mongoose';
import { Diagnose, DiagnoseDocument } from './entities/diagnose.entity';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';
export declare class DiagnoseService {
    private diagnoseModel;
    constructor(diagnoseModel: Model<DiagnoseDocument>);
    create(createDiagnoseDto: CreateDiagnoseDto): Promise<Diagnose>;
    findAll(): Promise<Diagnose[]>;
    findOne(id: string): Promise<Diagnose>;
    update(id: string, updateDiagnoseDto: UpdateDiagnoseDto): Promise<Diagnose>;
    remove(id: string): Promise<Diagnose>;
}
