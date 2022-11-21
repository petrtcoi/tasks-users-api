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
const task_model_1 = __importDefault(require("../../models/task.model"));
const task_model_2 = require("../../models/task.model");
const AppError_1 = require("../../types/AppError");
const schema = (0, task_model_2.taskValidateSchemaForPost)();
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body === undefined) {
        throw new AppError_1.AppError('tasks', 'body is undefined', 400);
    }
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error !== undefined) {
        throw new AppError_1.AppError('tasks', error.message, 400);
    }
    const task = new task_model_1.default(req.body);
    yield task.save();
    res.status(200).send(task);
    return;
});
exports.default = create;
