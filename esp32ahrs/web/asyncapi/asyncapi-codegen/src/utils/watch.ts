import chokidar from "chokidar";

export function watch(file: string, cb: () => void) {
	chokidar.watch(file).on("change", () => {
		console.log("🔄 Regenerating...");
		cb();
	});
}
