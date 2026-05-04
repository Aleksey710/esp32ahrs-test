export function resolveRef(ref: string, spec: any): any {
	const parts = ref.replace("#/", "").split("/");
	let current = spec;

	for (const part of parts) {
		current = current?.[part];
	}

	return current;
}
