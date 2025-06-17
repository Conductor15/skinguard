"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const patient_entity_1 = require("./entities/patient.entity");
const auth_service_1 = require("../auth/auth.service");
let PatientService = class PatientService {
    constructor(patientModel, authService) {
        this.patientModel = patientModel;
        this.authService = authService;
    }
    async create(createPatientDto) {
        const hashedPassword = await this.authService.hashPassword(createPatientDto.password);
        const patientData = Object.assign(Object.assign({}, createPatientDto), { password: hashedPassword });
        const createdPatient = new this.patientModel(patientData);
        return createdPatient.save();
    }
    async findAll() {
        return this.patientModel.find().exec();
    }
    async findOne(id) {
        return this.patientModel.findById(id).exec();
    }
    async update(id, updatePatientDto) {
        if (updatePatientDto.password) {
            updatePatientDto.password = await this.authService.hashPassword(updatePatientDto.password);
        }
        return this.patientModel
            .findByIdAndUpdate(id, updatePatientDto, { new: true })
            .exec();
    }
    async remove(id) {
        return this.patientModel.findByIdAndDelete(id).exec();
    }
    async validatePatient(email, password) {
        const patient = await this.patientModel.findOne({ email }).exec();
        if (patient && await this.authService.comparePassword(password, patient.password)) {
            return patient;
        }
        return null;
    }
};
PatientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(patient_entity_1.Patient.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        auth_service_1.AuthService])
], PatientService);
exports.PatientService = PatientService;
//# sourceMappingURL=patient.service.js.map