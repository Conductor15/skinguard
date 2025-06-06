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
exports.SkinLesionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const skin_leision_entity_1 = require("./entities/skin-leision.entity");
let SkinLesionService = class SkinLesionService {
    constructor(skinLesionModel) {
        this.skinLesionModel = skinLesionModel;
    }
    async create(createSkinLesionDto) {
        const createdSkinLesion = new this.skinLesionModel(createSkinLesionDto);
        return createdSkinLesion.save();
    }
    async findAll() {
        return this.skinLesionModel.find().exec();
    }
    async findOne(id) {
        return this.skinLesionModel.findById(id).exec();
    }
    async update(id, updateSkinLesionDto) {
        return this.skinLesionModel
            .findByIdAndUpdate(id, updateSkinLesionDto, { new: true })
            .exec();
    }
    async remove(id) {
        return this.skinLesionModel.findByIdAndDelete(id).exec();
    }
};
SkinLesionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(skin_leision_entity_1.SkinLesion.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SkinLesionService);
exports.SkinLesionService = SkinLesionService;
//# sourceMappingURL=skin-leision.service.js.map