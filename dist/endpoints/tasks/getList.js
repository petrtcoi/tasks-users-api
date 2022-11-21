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
Object.defineProperty(exports, "__esModule", { value: true });
const task_model_1 = __importStar(require("../../models/task.model"));
const AppError_1 = require("../../types/AppError");
const DEFAULT_LIMIT = 10;
const schema = (0, task_model_1.taskValidateSchemaGetListFilters)();
const getList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const props = req.query;
    const { error } = schema.validate(props, { abortEarly: false });
    if (error !== undefined) {
        throw new AppError_1.AppError('tasks', error.message, 400);
    }
    let filters = {};
    if (props.ownerId !== undefined)
        filters = Object.assign(filters, { ownerId: props.ownerId });
    if (props.deadlineDayIso !== undefined)
        filters = Object.assign(filters, { deadlineDayIso: props.deadlineDayIso });
    let options = {
        limit: props.limit || DEFAULT_LIMIT,
        skip: props.offset || 0
    };
    const tasks = yield task_model_1.default.find(filters, {}, options);
    res.status(200).send(tasks);
    return;
});
exports.default = getList;
