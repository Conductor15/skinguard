// import {
//   Controller,
//   Post,
//   Body,
//   UseGuards,
//   Headers,
//   Get,
//   Param,
//   Res,
//   Request,
//   Req,
// } from '@nestjs/common';
// import { Response, Request as ExpressRequest } from 'express';
// import { AuthService } from './auth.service';
// import { PatientService } from '../patient/patient.service';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { LocalAuthGuard } from './local-auth.guard';

// export class LoginDto {
//   email: string;
//   password: string;
// }

// export class RegisterPatientDto {
//   patient_id: string;
//   email: string;
//   password: string;
//   fullName: string;
//   // birthDay: Date;
//   birthDay: string;
//   phone?: string;
//   avatar?: string;
//   orderID?: string;
// }

// @Controller('auth')
// export class AuthController {
//   constructor(
//     private authService: AuthService,
//     private patientService: PatientService,
//   ) {}
//   @UseGuards(LocalAuthGuard)
//   @Post('login')
//   async handlelogin(
//     @Request() req,
//     @Body() loginDto: LoginDto,
//     @Res({ passthrough: true }) response: Response,
//   ) {
//     // LocalStrategy đã validate user và gắn vào req.user
//     // Kiểm tra xem user có phải là patient không
//     if (req.user.userType !== 'patient') {
//       return {
//         message: 'Access denied. Only patients can login through this system.',
//         error: 'PATIENT_ONLY_ACCESS',
//       };
//     }
//     console.log(' AuthController.login - patient validated:', req.user.email);

//     // Generate JWT token
//     const tokenData = await this.authService.generateJwtToken(
//       req.user,
//       response,
//     );

//     return {
//       message: 'Login successful',
//       ...tokenData,
//     };
//   }

//   @Post('register/patient')
//   async registerPatient(@Body() registerDto: RegisterPatientDto, @Req() req) {
//     console.log('==== REGISTER BODY ====');
//     console.log(req.body); // Log raw body nhận được
//     console.log('==== DTO ====');
//     console.log(registerDto); // Log sau khi đã qua ValidationPipe
//     try {
//       const patient = await this.patientService.create(registerDto);
//       return {
//         message: 'Patient registered successfully',
//         patient: patient,
//         originalPassword: registerDto.password, // Password gốc
//         hashedPassword: patient.password, // Password đã hash
//       };
//     } catch (error) {
//       return {
//         message: 'Registration failed',
//         error: error.message,
//       };
//     }
//   }

//   @UseGuards(JwtAuthGuard)
//   @Post('logout')
//   async handlelogout(
//     @Request() req,
//     @Res({ passthrough: true }) response: Response,
//   ) {
//     try {
//       // Clear the refresh token cookie
//       response.clearCookie('refresh_token');

//       // Optionally clear the refresh token from database
//       if (req.user && req.user.id) {
//         await this.patientService.updatePatientToken('', req.user.id);
//       }

//       return {
//         statuscode: 201,
//         message: 'Logout successful',
//         success: true,
//         timestamp: new Date().toISOString(),
//       };
//     } catch (error) {
//       return {
//         statuscode: 400,
//         message: 'Logout failed',
//         error: error.message,
//         success: false,
//       };
//     }
//   }
//   @UseGuards(JwtAuthGuard)
//   @Get('account')
//   async getProfile(@Request() req) {
//     // Kiểm tra xem user có phải là patient không
//     if (req.user.userType !== 'patient') {
//       return {
//         message: 'Access denied. Only patients can access account.',
//         error: 'PATIENT_ONLY_ACCESS',
//       };
//     }

//     return {
//       message: 'account accessed successfully',
//       user: req.user,
//       timestamp: new Date().toISOString(),
//     };
//   }

//   @Get('refresh')
//   async handleRefreshToken(
//     @Req() request: ExpressRequest,
//     @Res({ passthrough: true }) response: Response,
//   ) {
//     const token = request.cookies['refresh_token'];
//     if (!token) {
//       return {
//         message: 'No refresh token provided',
//         success: false,
//       };
//     }

//     try {
//       // Process the refresh token to get new access token
//       return await this.authService.processNewToken(token, response);
//     } catch (error) {
//       return {
//         message: 'Invalid refresh token',
//         error: error.message,
//         success: false,
//       };
//     }
//   }
// }
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
    if (req.user.userType !== 'patient') {
      return {
        message: 'Access denied. Only patients can login through this system.',
        error: 'PATIENT_ONLY_ACCESS',
      };
    }
    console.log(' AuthController.login - patient validated:', req.user.email);

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
      response.clearCookie('refresh_token');
      if (req.user && req.user.id) {
        await this.patientService.updatePatientToken('', req.user.id);
      }

      return {
        statuscode: 201,
        message: 'Logout successful',
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
    if (req.user.userType !== 'patient') {
      return {
        message: 'Access denied. Only patients can access account.',
        error: 'PATIENT_ONLY_ACCESS',
      };
    }

    return {
      message: 'account accessed successfully',
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