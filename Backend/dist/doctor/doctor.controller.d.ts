import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
export declare class DoctorController {
    private readonly doctorService;
    constructor(doctorService: DoctorService);
    create(createDoctorDto: CreateDoctorDto): Promise<import("./entities/doctor.entity").Doctor>;
    findAll(): Promise<import("./entities/doctor.entity").Doctor[]>;
    findOne(id: string): Promise<import("./entities/doctor.entity").Doctor>;
    update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<import("./entities/doctor.entity").Doctor>;
    remove(id: string): Promise<import("./entities/doctor.entity").Doctor>;
}
