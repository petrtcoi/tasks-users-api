"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValidateSchemaGetListFilters = exports.taskValidateSchemaForPatch = exports.taskValidateSchemaForPost = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    ownerId: {
        type: String,
        trim: true,
        required: true,
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: false,
    },
    deadlineDayIso: {
        type: String,
        trim: true,
        required: false,
    },
}, {
    timestamps: true,
    versionKey: false
});
const Task = mongoose_1.default.model('Task', schema);
exports.default = Task;
function taskValidateSchemaForPost() {
    return joi_1.default.object({
        ownerId: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string(),
        deadlineDayIso: joi_1.default.date().iso()
    });
}
exports.taskValidateSchemaForPost = taskValidateSchemaForPost;
function taskValidateSchemaForPatch() {
    return joi_1.default.object({
        ownerId: joi_1.default.string(),
        title: joi_1.default.string(),
        description: joi_1.default.string().allow(null, ''),
        deadlineDayIso: joi_1.default.date().iso().allow(null)
    });
}
exports.taskValidateSchemaForPatch = taskValidateSchemaForPatch;
function taskValidateSchemaGetListFilters() {
    return (joi_1.default.object({
        limit: joi_1.default.number().min(1).integer(),
        offset: joi_1.default.number().min(0).integer(),
        ownerId: joi_1.default.string(),
        deadlineDayIso: joi_1.default.date().iso()
    }));
}
exports.taskValidateSchemaGetListFilters = taskValidateSchemaGetListFilters;
