"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const patient_service_1 = require("./patient.service");
const patient_controller_1 = require("./patient.controller");
const patient_entity_1 = require("./entities/patient.entity");
const auth_module_1 = require("../auth/auth.module");
let PatientModule = class PatientModule {
};
PatientModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: patient_entity_1.Patient.name, schema: patient_entity_1.PatientSchema }]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [patient_controller_1.PatientController],
        providers: [patient_service_1.PatientService],
        exports: [patient_service_1.PatientService],
    })
], PatientModule);
exports.PatientModule = PatientModule;
//# sourceMappingURL=patient.module.js.map