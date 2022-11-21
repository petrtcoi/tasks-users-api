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
const isValidObjectIdString_1 = require("../../utils/isValidObjectIdString");
const AppError_1 = require("../../types/AppError");
const updatesSchema = (0, task_model_2.taskValidateSchemaForPatch)();
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskid;
    const updates = req.body;
    if (updates === undefined) {
        throw new AppError_1.AppError('tasks', 'updates are undefined', 400);
    }
    if ((0, isValidObjectIdString_1.isValidObjectIdString)(taskId) === false) {
        throw new AppError_1.AppError('tasks', 'taskid must by ObjectId', 400);
    }
    const { error } = updatesSchema.validate(updates, { abortEarly: false });
    if (error !== undefined) {
        throw new AppError_1.AppError('tasks', error.message, 400);
    }
    const task = yield task_model_1.default.findOneAndUpdate({ _id: taskId }, updates, { upsert: false, returnNewDocument: true });
    if (task === null) {
        throw new AppError_1.AppError('tasks', 'cant find the task by taskId', 404);
    }
    res.status(200).send(task);
    return;
});
exports.default = update;
