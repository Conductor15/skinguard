"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDiagnoseDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_diagnose_dto_1 = require("./create-diagnose.dto");
class UpdateDiagnoseDto extends (0, mapped_types_1.PartialType)(create_diagnose_dto_1.CreateDiagnoseDto) {
}
exports.UpdateDiagnoseDto = UpdateDiagnoseDto;
//# sourceMappingURL=update-diagnose.dto.js.map