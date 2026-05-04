import { Command } from "commander";
import { generate } from "./index";
import { watch } from "./utils/watch";

const program = new Command();

program
  .name("asyncapi-codegen")
  .version("0.1.0");

program
  .command("generate")
  .requiredOption("-i, --input <path>")
  .requiredOption("-o, --output <path>")
  .option("-w, --watch")
  .action(async (opts) => {
    await generate(opts);

    if (opts.watch) {
      console.log("👀 Watching...");
      watch(opts.input, () => generate(opts));
    }
  });

program.parse();
