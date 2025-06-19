"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnoseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const diagnose_service_1 = require("./diagnose.service");
const diagnose_controller_1 = require("./diagnose.controller");
const diagnose_entity_1 = require("./entities/diagnose.entity");
let DiagnoseModule = class DiagnoseModule {
};
DiagnoseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: diagnose_entity_1.Diagnose.name, schema: diagnose_entity_1.DiagnoseSchema },
            ]),
        ],
        controllers: [diagnose_controller_1.DiagnoseController],
        providers: [diagnose_service_1.DiagnoseService],
        exports: [diagnose_service_1.DiagnoseService],
    })
], DiagnoseModule);
exports.DiagnoseModule = DiagnoseModule;
//# sourceMappingURL=diagnose.module.js.map