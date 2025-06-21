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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @Inject(forwardRef(() => PatientService))
    private patientService: PatientService,
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
   * Validate user credentials - only allows patient login
   */
  async validateUser(email: string, password: string): Promise<any> {
    // Chỉ kiểm tra patient, không cho phép doctor đăng nhập
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
   * create refresh token
   */
  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });
    return refreshToken;
  };
  /**
   * Generate JWT token for authenticated user
   */
  async generateJwtToken(user: any, response: any) {
    const payload = {
      sub: user._id, // User ID
      email: user.email, // User email
      userType: user.userType,
    }; // const expirationTime = ms(
    //   this.configService.get<string>('JWT_ACCESS_EXPIRATION', '3600s'),
    // );
    const refreshToken = this.createRefreshToken(payload);

    //update patient with refresh token
    await this.patientService.updatePatientToken(refreshToken, user._id); //set refresh token as cookie
    const refreshExpiration = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION',
    );
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(refreshExpiration), //milisecond
    });

    return {
      statusCode: 201,
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      // refresh_token: refreshToken,
      // expires_in: expirationTime, //dùng jwt nên không cần tính toán thời gian hết hạn
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
  /**
   * Validate JWT payload - only validates patient tokens
   */
  async validateJwtPayload(payload: any): Promise<any> {
    if (payload.userType !== 'patient') {
      return null;
    }

    const user = await this.patientModel.findById(payload.sub).exec();

    if (!user) {
      return null;
    }

    const { password: _, ...result } = user.toObject();
    return { ...result, userType: 'patient' };
  }

  /**
   * Verify refresh token and generate new access token
   */
  async processNewToken(refreshtoken: string, response: any) {
    try {
      // Verify refresh token
      this.jwtService.verify(refreshtoken, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_SECRET',
          'default_refresh_secret',
        ),
      });

      // Find patient by refresh token
      const patient = await this.patientService.findpatientByToken(
        refreshtoken,
      );

      if (!patient) {
        throw new BadRequestException('Invalid refresh token, please login');
      }

      // Create new payload for new tokens
      const newPayload = {
        sub: patient._id,
        email: patient.email,
        userType: 'patient',
      };

      // Generate new refresh token
      const newRefreshToken = this.createRefreshToken(newPayload);

      // Update patient with new refresh token
      await this.patientService.updatePatientToken(
        newRefreshToken,
        patient._id,
      );

      // Set new refresh token as cookie
      const refreshExpiration = this.configService.get<string>(
        'JWT_REFRESH_EXPIRATION',
        '7d',
      );
      response.clearCookie('refresh_token'); // Clear old cookie
      response.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        maxAge: ms(refreshExpiration),
      });

      // Return new access token and user info
      return {
        statusCode: 201,
        access_token: this.jwtService.sign(newPayload),
        token_type: 'Bearer',
        user: {
          id: patient._id,
          email: patient.email,
          fullName: patient.fullName,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'Invalid refresh token, please login again',
      );
    }
  }

  /**
   * Logout user by clearing refresh token
   */
  logout = async (response: any, user: any) => {
    await this.patientService.updatePatientToken('', user._id);
    response.clearCookie('refresh_token'); // Clear refresh token cookie
    return {
      statusCode: 200,
      message: 'Logout successful',
    };
  };
}
