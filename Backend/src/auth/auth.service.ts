import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Patient, PatientDocument } from '../patient/entities/patient.entity';
import { PatientService } from '../patient/patient.service';
import { Doctor, DoctorDocument } from '../doctor/entities/doctor.entity';
import { DoctorService } from '../doctor/doctor.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { AUTH_CONSTANTS, UserType } from './constants/auth.constants';
import {
  JwtPayload,
  TokenResponse,
  UserInfo,
} from './interfaces/auth.interfaces';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @Inject(forwardRef(() => PatientService))
    private patientService: PatientService,
    @Inject(forwardRef(() => DoctorService))
    private doctorService: DoctorService,
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
   * Validate user credentials - allows both patient and doctor login
   */
  async validateUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      console.error('Email and password are required');
      return null;
    }

    if (!this.isValidEmail(email)) {
      console.error('Invalid email format:', email);
      return null;
    }

    // Kiểm tra patient trước
    try {
      const patient = await this.patientModel.findOne({ email }).exec();
      if (patient && (await this.comparePassword(password, patient.password))) {
        const { password: _, ...result } = patient.toObject();
        return { ...result, userType: UserType.PATIENT };
      }
    } catch (error) {
      console.error('Error validating patient:', error);
    }

    // Nếu không phải patient, kiểm tra doctor
    try {
      const doctor = await this.doctorModel
        .findOne({
          email,
          deleted: { $ne: true },
        })
        .exec();
      if (doctor && (await this.comparePassword(password, doctor.password))) {
        const { password: _, ...result } = doctor.toObject();
        return { ...result, userType: UserType.DOCTOR };
      }
    } catch (error) {
      console.error('Error validating doctor:', error);
    }

    return null;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  /**
   * Create refresh token
   */
  async createRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.getRequiredConfig('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.getRequiredConfig('JWT_REFRESH_EXPIRATION'),
    });
  }

  /**
   * Get required configuration value
   */
  private getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing required configuration: ${key}`);
    }
    return value;
  }
  /**
   * Generate JWT token for authenticated user
   */
  async generateJwtToken(
    user: any,
    response: Response,
  ): Promise<TokenResponse> {
    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      userType: user.userType, // Sử dụng userType từ validateUser
    };

    const refreshToken = await this.createRefreshToken(payload);

    // Update token dựa trên user type
    if (user.userType === UserType.PATIENT) {
      await this.patientService.updatePatientToken(refreshToken, user._id);
    } else if (user.userType === UserType.DOCTOR) {
      await this.doctorService.updateDoctorToken(refreshToken, user._id);
    }

    // Set refresh token as cookie
    const refreshExpiration = this.getRequiredConfig('JWT_REFRESH_EXPIRATION');
    response.cookie('refresh_token', refreshToken, {
      httpOnly: AUTH_CONSTANTS.COOKIE_OPTIONS.HTTP_ONLY,
      maxAge: ms(refreshExpiration),
    });

    return {
      statusCode: AUTH_CONSTANTS.STATUS_CODES.CREATED,
      access_token: this.jwtService.sign(payload),
      token_type: AUTH_CONSTANTS.TOKEN_TYPES.BEARER,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
      },
    };
  }

  /**
   * Extract user info safely
   */
  private extractUserInfo(user: any, userType: UserType): UserInfo {
    const { password, refreshToken, ...userInfo } = user.toObject();
    return {
      ...userInfo,
      id: user._id,
      userType: userType,
    };
  }
  /**
   * Validate JWT payload - validates both patient and doctor tokens
   */
  async validateJwtPayload(payload: JwtPayload): Promise<any> {
    try {
      if (payload.userType === UserType.PATIENT) {
        const user = await this.patientModel.findById(payload.sub).exec();
        if (!user) {
          console.warn('Patient not found for JWT payload sub:', payload.sub);
          return null;
        }
        return this.extractUserInfo(user, UserType.PATIENT);
      }

      if (payload.userType === UserType.DOCTOR) {
        const user = await this.doctorModel.findById(payload.sub).exec();
        if (!user || user.deleted) {
          console.warn('Doctor not found for JWT payload sub:', payload.sub);
          return null;
        }
        return this.extractUserInfo(user, UserType.DOCTOR);
      }

      console.warn('Invalid user type in JWT payload:', payload.userType);
      return null;
    } catch (error) {
      console.error('Error validating JWT payload:', error);
      return null;
    }
  }

  /**
   * Verify refresh token and generate new access token
   */
  async processNewToken(
    refreshtoken: string,
    response: Response,
  ): Promise<TokenResponse> {
    try {
      // Verify refresh token
      this.jwtService.verify(refreshtoken, {
        secret: this.getRequiredConfig('JWT_REFRESH_TOKEN_SECRET'),
      });

      // Tìm user (patient hoặc doctor)
      let user: any = await this.patientService.findpatientByToken(
        refreshtoken,
      );
      let userType = UserType.PATIENT;

      if (!user) {
        user = await this.doctorService.findDoctorByToken(refreshtoken);
        userType = UserType.DOCTOR;
      }

      if (!user) {
        throw new BadRequestException(
          AUTH_CONSTANTS.MESSAGES.INVALID_REFRESH_TOKEN,
        );
      }

      // Create new payload for new tokens
      const newPayload: JwtPayload = {
        sub: user._id,
        email: user.email,
        userType: userType,
      };

      // Generate new refresh token
      const newRefreshToken = await this.createRefreshToken(newPayload);

      // Update token dựa trên user type
      if (userType === UserType.PATIENT) {
        await this.patientService.updatePatientToken(newRefreshToken, user._id);
      } else {
        await this.doctorService.updateDoctorToken(newRefreshToken, user._id);
      }

      // Set new refresh token as cookie
      const refreshExpiration = this.getRequiredConfig(
        'JWT_REFRESH_EXPIRATION',
      );
      response.clearCookie('refresh_token');
      response.cookie('refresh_token', newRefreshToken, {
        httpOnly: AUTH_CONSTANTS.COOKIE_OPTIONS.HTTP_ONLY,
        maxAge: ms(refreshExpiration),
      });

      // Return new access token and user info
      return {
        statusCode: AUTH_CONSTANTS.STATUS_CODES.CREATED,
        access_token: this.jwtService.sign(newPayload),
        token_type: AUTH_CONSTANTS.TOKEN_TYPES.BEARER,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      };
    } catch (error) {
      console.error('Error processing new token:', error);
      throw new BadRequestException(
        AUTH_CONSTANTS.MESSAGES.INVALID_REFRESH_TOKEN,
      );
    }
  }

  /**
   * Logout user by clearing refresh token
   */
  async logout(
    response: Response,
    user: any,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      // Clear token dựa trên user type
      if (user.userType === UserType.PATIENT) {
        await this.patientService.updatePatientToken('', user._id);
      } else if (user.userType === UserType.DOCTOR) {
        await this.doctorService.updateDoctorToken('', user._id);
      }

      response.clearCookie('refresh_token');

      console.log(
        'User logged out successfully:',
        user.email,
        'as',
        user.userType,
      );

      return {
        statusCode: AUTH_CONSTANTS.STATUS_CODES.SUCCESS,
        message: AUTH_CONSTANTS.MESSAGES.LOGOUT_SUCCESS,
      };
    } catch (error) {
      console.error('Error during logout:', error);
      throw new BadRequestException('Logout failed');
    }
  }
}
