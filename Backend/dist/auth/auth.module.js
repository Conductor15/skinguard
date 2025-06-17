"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const passport_1 = require("@nestjs/passport");
const local_strategy_1 = require("./passport/local.strategy");
const jwt_strategy_1 = require("./passport/jwt.strategy");
const doctor_entity_1 = require("../doctor/entities/doctor.entity");
const patient_entity_1 = require("../patient/entities/patient.entity");
const doctor_module_1 = require("../doctor/doctor.module");
const patient_module_1 = require("../patient/patient.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            mongoose_1.MongooseModule.forFeature([
                { name: doctor_entity_1.Doctor.name, schema: doctor_entity_1.DoctorSchema },
                { name: patient_entity_1.Patient.name, schema: patient_entity_1.PatientSchema },
            ]),
            (0, common_1.forwardRef)(() => doctor_module_1.DoctorModule),
            (0, common_1.forwardRef)(() => patient_module_1.PatientModule),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secretOrPrivateKey: configService.get('JWT_ACCESS_TOKEN'), signOptions: {
                        expiresIn: configService.get('JWT_ACCESS_EXPIRATION'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map