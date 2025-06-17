import { Model } from 'mongoose';
import { Patient, PatientDocument } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthService } from '../auth/auth.service';
export declare class PatientService {
    private patientModel;
    private authService;
    constructor(patientModel: Model<PatientDocument>, authService: AuthService);
    create(createPatientDto: CreatePatientDto): Promise<Patient>;
    findAll(): Promise<Patient[]>;
    findOne(id: string): Promise<Patient>;
    update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient>;
    remove(id: string): Promise<Patient>;
    validatePatient(email: string, password: string): Promise<Patient | null>;
}
