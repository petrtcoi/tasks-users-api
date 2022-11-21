"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(route, message, status = 500) {
        super();
        this.name = 'AppError';
        this.route = route;
        this.message = message;
        this.status = status;
    }
}
exports.AppError = AppError;
