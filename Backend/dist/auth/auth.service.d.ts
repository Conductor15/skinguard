import { Model } from 'mongoose';
import { DoctorDocument } from '../doctor/entities/doctor.entity';
import { PatientDocument } from '../patient/entities/patient.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private doctorModel;
    private patientModel;
    private jwtService;
    private configService;
    private readonly saltRounds;
    constructor(doctorModel: Model<DoctorDocument>, patientModel: Model<PatientDocument>, jwtService: JwtService, configService: ConfigService);
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    validateUser(email: string, password: string): Promise<any>;
    generateJwtToken(user: any): Promise<{
        access_token: string;
        token_type: string;
        expires_in: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            userType: any;
        };
    }>;
    validateJwtPayload(payload: any): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        token_type: string;
        expires_in: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            userType: any;
        };
    }>;
}
