"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import getList from './getList'
// import get from './get'
const update_1 = __importDefault(require("./update"));
// import deleteTask from './delete'
const signup_1 = __importDefault(require("./signup"));
const login_1 = __importDefault(require("./login"));
const router = express_1.default.Router();
// router.get('/', getList)
// router.get('/:taskid', get)
router.post('/login', login_1.default);
router.post('/', signup_1.default);
router.patch('/:userid', update_1.default);
// router.delete('/:taskid', deleteTask)
exports.default = router;
