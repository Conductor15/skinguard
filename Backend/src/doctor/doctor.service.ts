import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    private authService: AuthService, // Inject AuthService
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    // Hash password trước khi lưu
    const hashedPassword = await this.authService.hashPassword(
      createDoctorDto.password,
    );

    const doctorData = {
      ...createDoctorDto,
      password: hashedPassword,
    };

    const createdDoctor = new this.doctorModel(doctorData);
    return createdDoctor.save();
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async findOne(id: string): Promise<Doctor> {
    return this.doctorModel.findById(id).exec();
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    // Nếu có password trong update, hash nó
    if (updateDoctorDto.password) {
      updateDoctorDto.password = await this.authService.hashPassword(
        updateDoctorDto.password,
      );
    }

    return this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Doctor> {
    return this.doctorModel.findByIdAndDelete(id).exec();
  }

  /**
   * Verify doctor login credentials
   */
  async validateDoctor(
    email: string,
    password: string,
  ): Promise<Doctor | null> {
    const doctor = await this.doctorModel.findOne({ email }).exec();

    if (
      doctor &&
      (await this.authService.comparePassword(password, doctor.password))
    ) {
      return doctor;
    }

    return null;
  }
}
