"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const doctor_entity_1 = require("../doctor/entities/doctor.entity");
const patient_entity_1 = require("../patient/entities/patient.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(doctorModel, patientModel, jwtService, configService) {
        this.doctorModel = doctorModel;
        this.patientModel = patientModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.saltRounds = 12;
    }
    async hashPassword(password) {
        return bcrypt.hash(password, this.saltRounds);
    }
    async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    async validateUser(email, password) {
        try {
            const doctor = await this.doctorModel.findOne({ email }).exec();
            if (doctor && (await this.comparePassword(password, doctor.password))) {
                const _a = doctor.toObject(), { password: _ } = _a, result = __rest(_a, ["password"]);
                return Object.assign(Object.assign({}, result), { userType: 'doctor' });
            }
        }
        catch (error) {
        }
        try {
            const patient = await this.patientModel.findOne({ email }).exec();
            if (patient && (await this.comparePassword(password, patient.password))) {
                const _b = patient.toObject(), { password: _ } = _b, result = __rest(_b, ["password"]);
                return Object.assign(Object.assign({}, result), { userType: 'patient' });
            }
        }
        catch (error) {
        }
        return null;
    }
    async generateJwtToken(user) {
        const payload = {
            sub: user._id,
            email: user.email,
            userType: user.userType,
            iat: Math.floor(Date.now() / 1000),
        };
        const expirationTime = this.configService.get('JWT_ACCESS_EXPIRATION', '3600s');
        return {
            access_token: this.jwtService.sign(payload),
            token_type: 'Bearer',
            expires_in: expirationTime,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                userType: user.userType,
            },
        };
    }
    async validateJwtPayload(payload) {
        let user = null;
        if (payload.userType === 'doctor') {
            user = await this.doctorModel.findById(payload.sub).exec();
        }
        else if (payload.userType === 'patient') {
            user = await this.patientModel.findById(payload.sub).exec();
        }
        if (!user) {
            return null;
        }
        const _a = user.toObject(), { password: _ } = _a, result = __rest(_a, ["password"]);
        return Object.assign(Object.assign({}, result), { userType: payload.userType });
    }
    async login(user) {
        return this.generateJwtToken(user);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(doctor_entity_1.Doctor.name)),
    __param(1, (0, mongoose_1.InjectModel)(patient_entity_1.Patient.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map