"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const user_model_1 = __importStar(require("../../models/user.model"));
const AppError_1 = require("../../types/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateJwt_1 = require("../../utils/generateJwt");
const CANT_LOGIN_MSG = 'Пользователь с таким email / паролем не найден';
const updatesSchema = (0, user_model_1.userValidateSchemaPost)();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    if (userData === undefined) {
        throw new AppError_1.AppError('users', 'request body is undefined', 400);
    }
    const { error } = updatesSchema.validate(userData, { abortEarly: false });
    if (error !== undefined) {
        throw new AppError_1.AppError('users', error.message, 400);
    }
    let user = yield user_model_1.default.findOne({ email: userData.email });
    if (user === null) {
        throw new AppError_1.AppError('users', CANT_LOGIN_MSG, 404);
    }
    const isMatch = yield bcrypt_1.default.compare(userData.password, user.password);
    if (isMatch === false) {
        throw new AppError_1.AppError('users', CANT_LOGIN_MSG, 404);
    }
    const newToken = (0, generateJwt_1.generateJwt)(user._id.toString());
    user.tokens = user.tokens.concat(newToken);
    yield user.save();
    user.password = '';
    user.tokens = [];
    res
        .status(200)
        .cookie("access_token", newToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60
        // secure:  true
    })
        .send(user);
});
exports.default = login;
