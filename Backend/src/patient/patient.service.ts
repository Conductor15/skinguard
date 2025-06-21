import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Patient, PatientDocument } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  private readonly saltRounds = 12;

  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Hash password trước khi lưu
    const hashedPassword = await bcrypt.hash(
      createPatientDto.password,
      this.saltRounds,
    );

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
      updatePatientDto.password = await bcrypt.hash(
        updatePatientDto.password,
        this.saltRounds,
      );
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
  async validatePatient(
    email: string,
    password: string,
  ): Promise<Patient | null> {
    const patient = await this.patientModel.findOne({ email }).exec();

    if (patient && (await bcrypt.compare(password, patient.password))) {
      return patient;
    }

    return null;
  }
  /**
   * update patient with refresh token
   */
  updatePatientToken = async (refreshToken: string, _id: string) => {
    return await this.patientModel.updateOne({ _id }, { refreshToken });
  };
  findpatientByToken = async (refreshToken: string) => {
    return await this.patientModel.findOne({ refreshToken });
  };

  // 
  async addDiagnoseToPatient(patientId: string, diagnoseId: string) {
    return this.patientModel.updateOne(
      { patient_id: patientId },
      { $addToSet: { diagnose_id_list: diagnoseId } }
    );
  }

  async removeDiagnoseFromPatient(patientId: string, diagnoseId: string) {
    return this.patientModel.updateOne(
      { patient_id: patientId },
      { $pull: { diagnose_id_list: diagnoseId } }
    );
  }
}
