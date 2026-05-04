export type LifecycleHandlers = {
	onConnect?: () => void;
	onDisconnect?: () => void;
	onMessage?: (type: string, payload: any) => void;
};
