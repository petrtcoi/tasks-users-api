"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidateSchemaPatch = exports.userValidateSchemaPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema = new mongoose_1.default.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        match: /.+@.+\..{2,}/
    },
    password: {
        type: String,
        required: true,
    },
    tokens: {
        type: [{ type: String }],
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
schema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified('password'))
            return next();
        user.password = yield bcrypt_1.default.hash(user.password, 8);
        next();
    });
});
const User = mongoose_1.default.model('User', schema);
exports.default = User;
function userValidateSchemaPost() {
    return (joi_1.default.object({
        email: joi_1.default.string().email({ tlds: { allow: false } }).required(),
        password: joi_1.default.string().min(6).required(),
    }));
}
exports.userValidateSchemaPost = userValidateSchemaPost;
function userValidateSchemaPatch() {
    return (joi_1.default.object({
        email: joi_1.default.string().email({ tlds: { allow: false } }),
        password: joi_1.default.string().min(6),
    }));
}
exports.userValidateSchemaPatch = userValidateSchemaPatch;
