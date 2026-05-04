"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("./index");
const watch_1 = require("./utils/watch");
const program = new commander_1.Command();
program
    .name("asyncapi-codegen")
    .version("0.1.0");
program
    .command("generate")
    .requiredOption("-i, --input <path>")
    .requiredOption("-o, --output <path>")
    .option("-w, --watch")
    .action(async (opts) => {
    await (0, index_1.generate)(opts);
    if (opts.watch) {
        console.log("👀 Watching...");
        (0, watch_1.watch)(opts.input, () => (0, index_1.generate)(opts));
    }
});
program.parse();
