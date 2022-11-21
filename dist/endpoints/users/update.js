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
const isValidObjectIdString_1 = require("../../utils/isValidObjectIdString");
const AppError_1 = require("../../types/AppError");
const getErrorMsg_1 = require("../../utils/getErrorMsg");
const updatesSchema = (0, user_model_2.userValidateSchemaPatch)();
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userid;
    const updates = req.body;
    if (updates === undefined) {
        throw new AppError_1.AppError('users', 'updates are undefined', 400);
    }
    if ((0, isValidObjectIdString_1.isValidObjectIdString)(userId) === false) {
        throw new AppError_1.AppError('users', 'userid must by ObjectId', 400);
    }
    const { error } = updatesSchema.validate(updates, { abortEarly: false });
    if (error !== undefined) {
        throw new AppError_1.AppError('users', error.message, 400);
    }
    let user = yield user_model_1.default.findOne({ _id: userId });
    if (user === null) {
        throw new AppError_1.AppError('users', 'cant find the user by userid', 404);
    }
    if (updates.password)
        user.password = updates.password;
    if (updates.email)
        user.email = updates.email;
    try {
        const result = yield user.save();
        result.tokens = [];
        result.password = '';
        res.status(200).send(result);
        return;
    }
    catch (err) {
        throw new AppError_1.AppError('users', `Не получилось создать пользователя. ${(0, getErrorMsg_1.getErrorMsg)(err)}`, 500);
    }
});
exports.default = update;
