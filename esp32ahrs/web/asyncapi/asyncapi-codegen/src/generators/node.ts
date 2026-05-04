export function generateNodeMock(): string {
    return `
export class MockServer {
    private handlers: Record<string, Function[]> = {};

    emit(type: string, payload: any) {
        const cbs = this.handlers[type] ?? [];
        for (const cb of cbs) cb(payload);
    }

    on(type: string, cb: Function) {
        if (!this.handlers[type]) this.handlers[type] = [];
        this.handlers[type].push(cb);
    }
}
`;
}
