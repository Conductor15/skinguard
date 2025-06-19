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
exports.ConsultService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const consult_entity_1 = require("./entities/consult.entity");
let ConsultService = class ConsultService {
    constructor(consultModel) {
        this.consultModel = consultModel;
    }
    async create(createConsultDto) {
        const createdConsult = new this.consultModel(createConsultDto);
        return createdConsult.save();
    }
    async findAll() {
        return this.consultModel.find().populate('patient_id').exec();
    }
    async findOne(id) {
        return this.consultModel.findById(id).populate('patient_id').exec();
    }
    async update(id, updateConsultDto) {
        return this.consultModel
            .findByIdAndUpdate(id, updateConsultDto, { new: true })
            .exec();
    }
    async remove(id) {
        return this.consultModel.findByIdAndDelete(id).exec();
    }
};
ConsultService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(consult_entity_1.Consult.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ConsultService);
exports.ConsultService = ConsultService;
//# sourceMappingURL=consult.service.js.map