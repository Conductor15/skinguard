import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DoctorService {
  private readonly saltRounds = 12;
  
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}
  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    // Hash password trước khi lưu
    const hashedPassword = await bcrypt.hash(
      createDoctorDto.password,
      this.saltRounds,
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
    return this.doctorModel.find({}).exec(); // Lấy tất cả kể cả deleted để frontend có thể hiển thị
  }
  async findOne(id: string): Promise<Doctor> {
    return this.doctorModel.findOne({ _id: id, deleted: { $ne: true } }).exec();
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    // Nếu có password trong update, hash nó
    if (updateDoctorDto.password) {
      updateDoctorDto.password = await bcrypt.hash(
        updateDoctorDto.password,
        this.saltRounds,
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
  }  /**
   * soft delete a doctor by ID
   */
  async softDelete(id: string): Promise<Doctor> {
    // Lấy doctor hiện tại để lưu previousStatus
    const currentDoctor = await this.doctorModel.findById(id).exec();
    if (!currentDoctor) {
      throw new Error('Doctor not found');
    }

    return this.doctorModel
      .findByIdAndUpdate(
        id, 
        { 
          deleted: true, 
          previousStatus: currentDoctor.status, // Lưu status hiện tại
          status: 'Suspended' 
        }, 
        { new: true }
      )
      .exec();
  }

  /**
   * restore a soft deleted doctor by ID
   */
  async restore(id: string): Promise<Doctor> {
    // Lấy doctor hiện tại để khôi phục previousStatus
    const currentDoctor = await this.doctorModel.findById(id).exec();
    if (!currentDoctor) {
      throw new Error('Doctor not found');
    }

    const updateData: any = { deleted: false };
    
    // Nếu có previousStatus, khôi phục nó
    if (currentDoctor.previousStatus) {
      updateData.status = currentDoctor.previousStatus;
      updateData.previousStatus = undefined; // Xóa previousStatus
    }

    return this.doctorModel
      .findByIdAndUpdate(id, updateData, { new: true })
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
      (await bcrypt.compare(password, doctor.password))
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

  /**
   * Update doctor refresh token
   */
  async updateDoctorToken(refreshToken: string, doctorId: string): Promise<Doctor> {
    return this.doctorModel.findByIdAndUpdate(
      doctorId,
      { refreshToken },
      { new: true }
    ).exec();
  }

  /**
   * Find doctor by refresh token
   */
  async findDoctorByToken(refreshToken: string): Promise<Doctor | null> {
    return this.doctorModel.findOne({ 
      refreshToken, 
      deleted: { $ne: true } 
    }).exec();
  }
}
