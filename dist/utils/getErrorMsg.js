"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMsg = void 0;
function getErrorMsg(error) {
    if (typeof error === 'string')
        return error;
    if (error instanceof Error)
        return error.message;
    return '';
}
exports.getErrorMsg = getErrorMsg;
