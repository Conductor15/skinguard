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
exports.DoctorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const doctor_entity_1 = require("./entities/doctor.entity");
let DoctorService = class DoctorService {
    constructor(doctorModel) {
        this.doctorModel = doctorModel;
    }
    async create(createDoctorDto) {
        const createdDoctor = new this.doctorModel(createDoctorDto);
        return createdDoctor.save();
    }
    async findAll() {
        return this.doctorModel.find().exec();
    }
    async findOne(id) {
        return this.doctorModel.findById(id).exec();
    }
    async update(id, updateDoctorDto) {
        return this.doctorModel
            .findByIdAndUpdate(id, updateDoctorDto, { new: true })
            .exec();
    }
    async remove(id) {
        return this.doctorModel.findByIdAndDelete(id).exec();
    }
};
DoctorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(doctor_entity_1.Doctor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DoctorService);
exports.DoctorService = DoctorService;
//# sourceMappingURL=doctor.service.js.map