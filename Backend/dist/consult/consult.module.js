"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const consult_service_1 = require("./consult.service");
const consult_controller_1 = require("./consult.controller");
const consult_entity_1 = require("./entities/consult.entity");
let ConsultModule = class ConsultModule {
};
ConsultModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: consult_entity_1.Consult.name, schema: consult_entity_1.ConsultSchema }]),
        ],
        controllers: [consult_controller_1.ConsultController],
        providers: [consult_service_1.ConsultService],
        exports: [consult_service_1.ConsultService],
    })
], ConsultModule);
exports.ConsultModule = ConsultModule;
//# sourceMappingURL=consult.module.js.map