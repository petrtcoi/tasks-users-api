"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getList_1 = __importDefault(require("./getList"));
const get_1 = __importDefault(require("./get"));
const update_1 = __importDefault(require("./update"));
const delete_1 = __importDefault(require("./delete"));
const create_1 = __importDefault(require("./create"));
const router = express_1.default.Router();
router.get('/', getList_1.default);
router.get('/:taskid', get_1.default);
router.post('/', create_1.default);
router.patch('/:taskid', update_1.default);
router.delete('/:taskid', delete_1.default);
exports.default = router;
