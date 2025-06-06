import { DiagnoseService } from './diagnose.service';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';
export declare class DiagnoseController {
    private readonly diagnoseService;
    constructor(diagnoseService: DiagnoseService);
    create(createDiagnoseDto: CreateDiagnoseDto): Promise<import("./entities/diagnose.entity").DiagnoseList>;
    findAll(): Promise<import("./entities/diagnose.entity").DiagnoseList[]>;
    findOne(id: string): Promise<import("./entities/diagnose.entity").DiagnoseList>;
    update(id: string, updateDiagnoseDto: UpdateDiagnoseDto): Promise<import("./entities/diagnose.entity").DiagnoseList>;
    remove(id: string): Promise<import("./entities/diagnose.entity").DiagnoseList>;
}
