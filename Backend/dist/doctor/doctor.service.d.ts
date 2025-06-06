import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
export declare class DoctorService {
    private doctorModel;
    constructor(doctorModel: Model<DoctorDocument>);
    create(createDoctorDto: CreateDoctorDto): Promise<Doctor>;
    findAll(): Promise<Doctor[]>;
    findOne(id: string): Promise<Doctor>;
    update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor>;
    remove(id: string): Promise<Doctor>;
}
