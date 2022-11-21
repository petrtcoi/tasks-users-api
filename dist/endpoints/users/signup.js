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
const user_model_1 = __importDefault(require("../../models/user.model"));
const user_model_2 = require("../../models/user.model");
const AppError_1 = require("../../types/AppError");
const getErrorMsg_1 = require("../../utils/getErrorMsg");
const mongoose_1 = __importDefault(require("mongoose"));
const generateJwt_1 = require("../../utils/generateJwt");
const schema = (0, user_model_2.userValidateSchemaPost)();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body === undefined) {
        throw new AppError_1.AppError('users', 'body is undefined', 400);
    }
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error !== undefined) {
        throw new AppError_1.AppError('users', error.message, 400);
    }
    const userId = new mongoose_1.default.Types.ObjectId();
    const token = (0, generateJwt_1.generateJwt)(userId.toString());
    const user = new user_model_1.default(Object.assign(Object.assign({}, req.body), { _id: userId, tokens: [token] }));
    try {
        const result = yield user.save();
        result.password = '';
        result.tokens = [];
        res
            .status(200)
            .cookie("access_token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60
            // secure:  true
        })
            .send(result);
        return;
    }
    catch (err) {
        throw new AppError_1.AppError('users', `Не получилось создать пользователя. ${(0, getErrorMsg_1.getErrorMsg)(err)}`, 500);
    }
});
exports.default = signup;
