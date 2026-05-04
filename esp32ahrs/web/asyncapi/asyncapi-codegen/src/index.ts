import fs from "fs-extra";
import { loadSpec } from "./core/load-spec";
import { analyzeServer } from "./core/analyze-server";

import { generateTypes } from "./generators/types";
import { generateSchemaModule } from "./generators/schema";
import { generateClient } from "./generators/client";
import { generateBrowserStores } from "./generators/browser";
import { generateNodeMock } from "./generators/node";

export async function generate(opts: any) {
    const spec = loadSpec(opts.input);

    fs.ensureDirSync(opts.output);

    // types
    fs.outputFileSync(
        `${opts.output}/types.ts`,
        generateTypes(spec)
    );

    fs.outputFileSync(
        `${opts.output}/schemas.ts`,
        generateSchemaModule(spec)
    );

    // client (ws / mock)
    fs.outputFileSync(
        `${opts.output}/client.ts`,
        generateClient(spec)
    );

    // browser SDK
    const stores = generateBrowserStores(spec);

    for (const [name, code] of Object.entries(stores)) {
        fs.outputFileSync(
            `${opts.output}/browser/stores/${name}.ts`,
            code
        );
    }

    // node mock server
    fs.outputFileSync(
        `${opts.output}/node/mock.ts`,
        generateNodeMock()
    );

    console.log("✔ AsyncAPI codegen completed");
}
