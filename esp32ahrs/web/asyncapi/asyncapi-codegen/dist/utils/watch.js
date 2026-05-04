"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = watch;
const chokidar_1 = __importDefault(require("chokidar"));
function watch(file, cb) {
    chokidar_1.default.watch(file).on("change", () => {
        console.log("🔄 Regenerating...");
        cb();
    });
}
