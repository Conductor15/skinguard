import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    create(createPatientDto: CreatePatientDto): Promise<import("./entities/patient.entity").Patient>;
    findAll(): Promise<import("./entities/patient.entity").Patient[]>;
    findOne(id: string): Promise<import("./entities/patient.entity").Patient>;
    update(id: string, updatePatientDto: UpdatePatientDto): Promise<import("./entities/patient.entity").Patient>;
    remove(id: string): Promise<import("./entities/patient.entity").Patient>;
}
