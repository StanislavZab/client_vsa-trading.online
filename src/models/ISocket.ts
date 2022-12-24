export interface ServerToClientEvents {
	message: (f: any) => void;
	data: (cmd: string, data: string, cb: (res: any, err: string) => void) => void;
	subCode: (index: number, class_code: string, sec_code: string, timeframe: number) => void;
	unsubCode: (index: number, class_code: string, sec_code: string, timeframe: number) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	data: (d: any, callback: (e: number) => void) => void;
	connectedQuik: (connected: boolean) => void;
	newCandle: (data: any) => void;
	updateCandle: (data: any) => void;
}