"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSpec = loadSpec;
const fs_extra_1 = __importDefault(require("fs-extra"));
const js_yaml_1 = __importDefault(require("js-yaml"));
function loadSpec(path) {
    const raw = fs_extra_1.default.readFileSync(path, "utf-8");
    return js_yaml_1.default.load(raw);
}
