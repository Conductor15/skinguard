import { DiagnoseService } from './diagnose.service';
import { CreateDiagnoseDto } from './dto/create-diagnose.dto';
import { UpdateDiagnoseDto } from './dto/update-diagnose.dto';
export declare class DiagnoseController {
    private readonly diagnoseService;
    constructor(diagnoseService: DiagnoseService);
    create(createDiagnoseDto: CreateDiagnoseDto): Promise<import("./entities/diagnose.entity").Diagnose>;
    findAll(): Promise<import("./entities/diagnose.entity").Diagnose[]>;
    findOne(id: string): Promise<import("./entities/diagnose.entity").Diagnose>;
    update(id: string, updateDiagnoseDto: UpdateDiagnoseDto): Promise<import("./entities/diagnose.entity").Diagnose>;
    remove(id: string): Promise<import("./entities/diagnose.entity").Diagnose>;
}
