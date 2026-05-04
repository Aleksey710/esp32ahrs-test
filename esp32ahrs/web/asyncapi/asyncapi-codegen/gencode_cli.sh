#!/usr/bin/env node

import { Command } from "commander";
import { generate } from "./index";

const program = new Command();

program
  .name("asyncapi-codegen")
  .description("Type-safe AsyncAPI code generator")
  .version("0.1.0");

program
  .command("generate")
  .requiredOption("-i, --input <path>", "AsyncAPI file")
  .requiredOption("-o, --output <path>", "Output directory")
  .option("-w, --watch", "Watch mode")
  .action(async (opts) => {
    await generate(opts);

    if (opts.watch) {
      console.log("👀 Watching for changes...");
      watch(opts.input, () => generate(opts));
    }
  });

program.parse();
