"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT;
const mode = process.env.MODE;
app_1.default.on('ready', () => {
    app_1.default.listen(port, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${port}. Mode: ${mode}`);
    });
});
app_1.default.on('error', () => {
    console.log('ERROR');
});
