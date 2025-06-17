import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../patient/patient.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDoctorDto {
  doctor_id: string;
  email: string;
  password: string;
  fullName: string;
  discipline: string;
  permission: string;
  phoneNumber: string;
  rating?: number;
  avatar?: string;
}

export class RegisterPatientDto {
  patient_id: string;
  email: string;
  password: string;
  fullName: string;
  birthDay: Date;
  avatar?: string;
  orderID?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private doctorService: DoctorService,
    private patientService: PatientService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    // LocalStrategy đã validate user và gắn vào req.user
    console.log(' AuthController.login - user validated:', req.user.email);

    // Generate JWT token
    const tokenData = await this.authService.generateJwtToken(req.user);

    return {
      message: 'Login successful',
      ...tokenData,
    };
  }
  @Post('register/doctor')
  async registerDoctor(@Body() registerDto: RegisterDoctorDto) {
    try {
      const doctor = await this.doctorService.create(registerDto);
      return {
        message: 'Doctor registered successfully',
        doctor: doctor,
        originalPassword: registerDto.password, // Password gốc
        hashedPassword: doctor.password, // Password đã hash
      };
    } catch (error) {
      return {
        message: 'Registration failed',
        error: error.message,
      };
    }
  }

  @Post('register/patient')
  async registerPatient(@Body() registerDto: RegisterPatientDto) {
    try {
      const patient = await this.patientService.create(registerDto);
      return {
        message: 'Patient registered successfully',
        patient: patient,
        originalPassword: registerDto.password, // Password gốc
        hashedPassword: patient.password, // Password đã hash
      };
    } catch (error) {
      return {
        message: 'Registration failed',
        error: error.message,
      };
    }
  }
  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        message: 'No token provided',
        success: false,
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Nếu có JWT Manager service, sử dụng nó
      // const result = await this.authService.logout(token);
      console.log(
        ' Logging out user with token:',
        token.substring(0, 20) + '...',
      );

      return {
        message: 'Logout successful',
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        message: 'Logout failed',
        error: error.message,
        success: false,
      };
    }
  }
  // Example: Protected route using JWT
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return {
      message: 'Profile accessed successfully',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}
