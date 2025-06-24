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
      deleted: false, // Mặc định không bị xóa
      permission: 'doctor', // Mặc định permission
    };

    const createdDoctor = new this.doctorModel(doctorData);
    return createdDoctor.save();
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find({ deleted: { $ne: true } }).exec();
  }
  async findOne(id: string): Promise<Doctor> {
    return this.doctorModel.findOne({ _id: id, deleted: { $ne: true } }).exec();
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    // Nếu có password trong update, hash nó
    if (updateDoctorDto.password) {
      updateDoctorDto.password = await this.authService.hashPassword(
        updateDoctorDto.password,
      );
    }

    return this.doctorModel
      .findOneAndUpdate(
        { _id: id, deleted: { $ne: true } }, 
        updateDoctorDto, 
        { new: true }
      )
      .exec();
  }

  /**
   * hard delete a doctor by ID
   */
  async hardDelete(id: string): Promise<Doctor> {
    return this.doctorModel.findByIdAndDelete(id).exec();
  }

  /**
   * soft delete a doctor by ID
   */
  async softDelete(id: string): Promise<Doctor> {
    return this.doctorModel
      .findByIdAndUpdate(id, { deleted: true }, { new: true })
      .exec();
  }

  /**
   * Verify doctor login credentials
   */
  async validateDoctor(
    email: string,
    password: string,
  ): Promise<Doctor | null> {
    const doctor = await this.doctorModel.findOne({ 
      email, 
      deleted: { $ne: true } 
    }).exec();

    if (
      doctor &&
      (await this.authService.comparePassword(password, doctor.password))
    ) {
      return doctor;
    }

    return null;
  }

  /**
   * Get next available doctor ID
   */
  async getNextDoctorId(): Promise<string> {
    const prefix = "DCT";
    const doctors = await this.doctorModel.find({}).select('doctor_id').exec();
    
    const usedNumbers = doctors
      .map(doc => doc.doctor_id)
      .filter(id => id && id.startsWith(prefix))
      .map(id => parseInt(id.replace(prefix, ""), 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    if (usedNumbers.length === 0) {
      return prefix + "001";
    }

    // Tìm số lớn nhất và tăng thêm 1
    const maxNum = Math.max(...usedNumbers);
    const nextNum = maxNum + 1;
    
    return prefix + nextNum.toString().padStart(3, "0");
  }
}
