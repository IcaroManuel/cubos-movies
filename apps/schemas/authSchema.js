'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.authSchema = void 0;
const zod_1 = require('zod');
exports.authSchema = zod_1.z.object({
  name: zod_1.z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres.'),
  email: zod_1.z.string().email('Formato de e-mail inválido.'),
  password: zod_1.z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
});
//# sourceMappingURL=authSchema.js.map
