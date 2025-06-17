import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    private authService: AuthService,
  ) {}
  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Hash password trước khi lưu
    const hashedPassword = await this.authService.hashPassword(createPatientDto.password);
    
    const patientData = {
      ...createPatientDto,
      password: hashedPassword,
    };
    
    const createdPatient = new this.patientModel(patientData);
    return createdPatient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findOne(id: string): Promise<Patient> {
    return this.patientModel.findById(id).exec();
  }
  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    // Nếu có password trong update, hash nó
    if (updatePatientDto.password) {
      updatePatientDto.password = await this.authService.hashPassword(updatePatientDto.password);
    }
    
    return this.patientModel
      .findByIdAndUpdate(id, updatePatientDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Patient> {
    return this.patientModel.findByIdAndDelete(id).exec();
  }

  /**
   * Verify patient login credentials
   */
  async validatePatient(email: string, password: string): Promise<Patient | null> {
    const patient = await this.patientModel.findOne({ email }).exec();
    
    if (patient && await this.authService.comparePassword(password, patient.password)) {
      return patient;
    }
    
    return null;
  }
}
