"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateJwt(userId) {
    const token = jsonwebtoken_1.default.sign({ _id: userId }, process.env.SECRET_WORD || 'some_word', { expiresIn: '7 days' });
    return token;
}
exports.generateJwt = generateJwt;
