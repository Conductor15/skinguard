import { Model } from 'mongoose';
import { DiagnoseList, DiagnoseListDocument } from './entities/diagnose.entity';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';
export declare class DiagnoseService {
    private diagnoseModel;
    constructor(diagnoseModel: Model<DiagnoseListDocument>);
    create(createDiagnoseDto: CreateDiagnoseDto): Promise<DiagnoseList>;
    findAll(): Promise<DiagnoseList[]>;
    findOne(id: string): Promise<DiagnoseList>;
    update(id: string, updateDiagnoseDto: UpdateDiagnoseDto): Promise<DiagnoseList>;
    remove(id: string): Promise<DiagnoseList>;
}
