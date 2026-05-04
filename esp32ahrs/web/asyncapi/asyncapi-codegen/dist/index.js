"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs_extra_1 = __importDefault(require("fs-extra"));
const load_spec_1 = require("./core/load-spec");
const types_1 = require("./generators/types");
const schema_1 = require("./generators/schema");
const client_1 = require("./generators/client");
const browser_1 = require("./generators/browser");
const node_1 = require("./generators/node");
async function generate(opts) {
    const spec = (0, load_spec_1.loadSpec)(opts.input);
    fs_extra_1.default.ensureDirSync(opts.output);
    // types
    fs_extra_1.default.outputFileSync(`${opts.output}/types.ts`, (0, types_1.generateTypes)(spec));
    fs_extra_1.default.outputFileSync(`${opts.output}/schemas.ts`, (0, schema_1.generateSchemaModule)(spec));
    // client (ws / mock)
    fs_extra_1.default.outputFileSync(`${opts.output}/client.ts`, (0, client_1.generateClient)(spec));
    // browser SDK
    const stores = (0, browser_1.generateBrowserStores)(spec);
    for (const [name, code] of Object.entries(stores)) {
        fs_extra_1.default.outputFileSync(`${opts.output}/browser/stores/${name}.ts`, code);
    }
    // node mock server
    fs_extra_1.default.outputFileSync(`${opts.output}/node/mock.ts`, (0, node_1.generateNodeMock)());
    console.log("✔ AsyncAPI codegen completed");
}
