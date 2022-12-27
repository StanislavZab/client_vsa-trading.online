import { ClientToServerEvents, ServerToClientEvents } from "models/ISocket";
import { Socket } from "socket.io-client";
import { InfoCode } from "store";

type TypeSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

class SocketService { 
    static async getFirstParam(socket: TypeSocket, 
        class_code: string, 
        sec_code: string, 
        tf1: number,
        tf2: number): Promise<[string, string, InfoCode, any, any]> {
        return await Promise.all([
            await SocketService.getClassList(socket),
            await SocketService.getClassSecurities(socket, class_code),
            await SocketService.getSecurityInfo(socket, class_code, sec_code),
			await SocketService.getCandlesFromDataSource(socket, class_code, sec_code, tf1, 3000),
            await SocketService.getCandlesFromDataSource(socket, class_code, sec_code, tf2, 3000)
        ]);
    }
    static async getClassList(socket: TypeSocket): Promise<string> {
        return new Promise((resolve, reject) => {
            socket.emit('data', 'getClassesList', '', (res, err) => {
                if(err) return reject(err);
                return resolve(res);
            });
        });
    }

    static async getClassSecurities(socket: TypeSocket, class_code: string): Promise<string> {
        return new Promise((resolve, reject) => {
            socket.emit('data', 'getClassSecurities', class_code, (res, err) => {
                if(err) return reject(err);
                return resolve(res);
            });
        });
    }

    static async getSecurityInfo(socket: TypeSocket, class_code: string, sec_code: string): Promise<InfoCode> {
        return new Promise((resolve, reject) => {
            socket.emit('data', 'getSecurityInfo', `${class_code}|${sec_code}`, (res, err) => {
                if(err) return reject(err);
                const infoCode: InfoCode = {
                    base_active_classcode: res.base_active_classcode,
                    base_active_seccode: res.base_active_seccode,
                    class_code: res.class_code,
                    class_name: res.class_name,
                    code: res.code,
                    exp_date: res.exp_date,
                    mat_date: res.mat_date,
                    min_price_step: res.min_price_step,
                    name: res.name,
                    scale: res.scale,
                    sec_code: res.sec_code,
                    short_name: res.short_name,
                }
                return resolve(infoCode);
            });
        });
    }

    static async getCandlesFromDataSource(socket: TypeSocket, class_code: string, sec_code: string, timeframe: number, count: number): Promise<string> {
        return new Promise((resolve, reject) => {
            socket.emit('data', 'get_candles_from_data_source', `${class_code}|${sec_code}|${timeframe}|${count}`, (res, err) => {
                if(err) return reject(err);
                return resolve(res);
            });
        });
    }

    static async subscribeToCandles(socket: TypeSocket, class_code: string, sec_code: string, timeframe: number) {
        return new Promise((resolve, reject) => {
            socket.emit('subCode', 0, class_code, sec_code, timeframe);
            // socket.emit('data', 'subscribe_to_candles', `${class_code}|${sec_code}|${timeframe}`, (res, err) => {
            //     if(err) return reject(err);
            //     return resolve(res);
            // });
            resolve(true);
        });
    }

    static async unsubscribeToCandles(socket: TypeSocket, class_code: string, sec_code: string, timeframe: number) {
        return new Promise((resolve, reject) => {
            socket.emit('unsubCode', 0, class_code, sec_code, timeframe);
            resolve(true);
        });
    }
}

export default SocketService;