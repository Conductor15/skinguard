"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const config_2 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const patient_module_1 = require("./patient/patient.module");
const doctor_module_1 = require("./doctor/doctor.module");
const diagnose_module_1 = require("./diagnose/diagnose.module");
const order_module_1 = require("./order/order.module");
const skin_leision_module_1 = require("./skin-leision/skin-leision.module");
const consult_module_1 = require("./consult/consult.module");
const product_module_1 = require("./product/product.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_2.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            config_2.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            patient_module_1.PatientModule,
            doctor_module_1.DoctorModule,
            diagnose_module_1.DiagnoseModule,
            order_module_1.OrderModule,
            product_module_1.ProductModule,
            consult_module_1.ConsultModule,
            skin_leision_module_1.SkinLesionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map