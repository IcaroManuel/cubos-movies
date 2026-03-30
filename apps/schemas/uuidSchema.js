"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.uuidSchema = zod_1.default.object({
    id: zod_1.default.string().uuid(),
});
//# sourceMappingURL=uuidSchema.js.map