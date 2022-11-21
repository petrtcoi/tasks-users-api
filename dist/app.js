"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const env_config_1 = require("./env.config");
require('express-async-errors');
const router_1 = __importDefault(require("./endpoints/tasks/router"));
const router_2 = __importDefault(require("./endpoints/users/router"));
const handleError_1 = require("./middlewares/handleError");
const authUser_1 = require("./middlewares/authUser");
(0, env_config_1.dotenvConfig)();
Object.freeze(Object.prototype);
const app = (0, express_1.default)();
// MIDDLEWARE
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
// ROUTERS
app.use('/tasks', authUser_1.authUser, router_1.default);
app.use('/users', router_2.default);
app.get('/', (_, res) => {
    res.status(200).send('Im alive');
    return;
});
// ERROR HANDLER
app.use(handleError_1.handleError);
mongoose_1.default.connect((_a = process.env.MONGODB_URL) !== null && _a !== void 0 ? _a : '', {})
    .then(() => {
    app.emit('ready');
}).catch((err) => {
    app.emit('error');
});
exports.default = app;
