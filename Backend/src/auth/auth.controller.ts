import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  Get,
  Param,
  Res,
  Request,
  Req,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { PatientService } from '../patient/patient.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { CreatePatientDto } from '../patient/dto/create-patient.dto'; // <-- Sử dụng DTO chuẩn
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private patientService: PatientService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async handlelogin(
    @Request() req,
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('AuthController.login - user validated:', req.user.email, 'as', req.user.userType);

    // Generate JWT token
    const tokenData = await this.authService.generateJwtToken(
      req.user,
      response,
    );

    return {
      message: 'Login successful',
      ...tokenData,
    };
  }

  @Post('register/patient')
  async registerPatient(@Body() registerDto: CreatePatientDto, @Req() req) {
    console.log('==== REGISTER BODY ====');
    console.log(req.body); // Log raw body nhận được
    console.log('==== DTO ====');
    console.log(registerDto); // Log sau khi đã qua ValidationPipe
    try {
      const patient = await this.patientService.create(registerDto);
      return {
        message: 'Patient registered successfully',
        patient: patient,
        originalPassword: registerDto.password,
        hashedPassword: patient.password,
      };
    } catch (error) {
      return {
        message: 'Registration failed',
        error: error.message,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async handlelogout(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.logout(response, req.user);
      
      return {
        ...result,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        statuscode: 400,
        message: 'Logout failed',
        error: error.message,
        success: false,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('account')
  async getProfile(@Request() req) {
    return {
      message: 'Account accessed successfully',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('refresh')
  async handleRefreshToken(
    @Req() request: ExpressRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.cookies['refresh_token'];
    if (!token) {
      return {
        message: 'No refresh token provided',
        success: false,
      };
    }

    try {
      return await this.authService.processNewToken(token, response);
    } catch (error) {
      return {
        message: 'Invalid refresh token',
        error: error.message,
        success: false,
      };
    }
  }
}