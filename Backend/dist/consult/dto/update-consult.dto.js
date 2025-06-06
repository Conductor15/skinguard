"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConsultDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_consult_dto_1 = require("./create-consult.dto");
class UpdateConsultDto extends (0, mapped_types_1.PartialType)(create_consult_dto_1.CreateConsultDto) {
}
exports.UpdateConsultDto = UpdateConsultDto;
//# sourceMappingURL=update-consult.dto.js.map