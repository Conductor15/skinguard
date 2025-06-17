import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Doctor, DoctorDocument } from '../doctor/entities/doctor.entity';
import { Patient, PatientDocument } from '../patient/entities/patient.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Hash a plain text password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare plain text password with hashed password
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  /**
   * Validate user credentials - checks both doctor and patient
   */
  async validateUser(email: string, password: string): Promise<any> {
    // Tìm trong doctor trước
    try {
      const doctor = await this.doctorModel.findOne({ email }).exec();
      if (doctor && (await this.comparePassword(password, doctor.password))) {
        const { password: _, ...result } = doctor.toObject(); //delete password from result
        return { ...result, userType: 'doctor' }; // Add userType to distinguish between doctor and patient
      }
    } catch (error) {
      // Ignore error, continue to check patient
    }

    // Nếu không tìm thấy doctor, tìm trong patient
    try {
      const patient = await this.patientModel.findOne({ email }).exec();
      if (patient && (await this.comparePassword(password, patient.password))) {
        const { password: _, ...result } = patient.toObject();
        return { ...result, userType: 'patient' };
      }
    } catch (error) {
      // Ignore error
    }

    return null;
  }
  /**
   * Generate JWT token for authenticated user
   */ async generateJwtToken(user: any) {
    const payload = {
      sub: user._id, // User ID
      email: user.email, // User email
      userType: user.userType, // doctor/patient
      iat: Math.floor(Date.now() / 1000), // Issued at
    };    // Lấy thời gian expiration thật từ config
    const expirationTime = this.configService.get<string>(
      'JWT_ACCESS_EXPIRATION',
      '3600s',
    );

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      expires_in: expirationTime, // ← THỜI GIAN THẬT từ config
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
      },
    };
  }

  /**
   * Validate JWT payload
   */
  async validateJwtPayload(payload: any): Promise<any> {
    // Tìm user dựa trên payload
    let user = null;

    if (payload.userType === 'doctor') {
      user = await this.doctorModel.findById(payload.sub).exec();
    } else if (payload.userType === 'patient') {
      user = await this.patientModel.findById(payload.sub).exec();
    }

    if (!user) {
      return null;
    }

    const { password: _, ...result } = user.toObject();
    return { ...result, userType: payload.userType };
  }

  // Legacy method - keep for compatibility
  async login(user: any) {
    return this.generateJwtToken(user);
  }
}
