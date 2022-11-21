"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const AppError_1 = require("../types/AppError");
function handleError(err, req, res, next) {
    if (typeof err === 'string') {
        res.status(500).send({ error: err });
    }
    if (err instanceof AppError_1.AppError) {
        res.status(err.status).send({ error: `${err.route.toUpperCase()}: ${err.message}` });
    }
    if (err instanceof TypeError) {
        res.status(500).send({ error: err.message });
    }
    res.status(500).send({ error: 'Something broke!' });
}
exports.handleError = handleError;
