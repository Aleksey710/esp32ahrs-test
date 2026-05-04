import fs from "fs-extra";
import yaml from "js-yaml";

export function loadSpec(path: string): any {
	const raw = fs.readFileSync(path, "utf-8");
	return yaml.load(raw);
}
