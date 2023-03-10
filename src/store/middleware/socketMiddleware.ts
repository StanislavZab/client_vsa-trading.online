import { io, Socket } from "socket.io-client";
import { Middleware } from 'redux';
import { RootState} from '../../store';
import { setFirstCandles, setClasses, setCodes, setInfoCode, addFirstCandle, updateFirstCandle, setSecondCandles, updateSecondCandle } from '../chartSlice';
import { setErrorSocket, setLoad } from "store/userSlice";
import { ClientToServerEvents, ServerToClientEvents } from "models/ISocket";
import SocketService from "service/socket-service";


export const socketMiddleware = (): Middleware<{}, RootState> => {
	let socket: Socket<ClientToServerEvents, ServerToClientEvents>;
	const SERVER_URL = 'https://' + window.location.host.split(':')[0];


	return store => next => action => {
		const chartState = store.getState().chart;
		switch(action.type) {
			case 'CONNECT':
				if(socket != null) {
					socket.close();
				}
				socket = io(SERVER_URL, {
						auth: {
							token: localStorage.getItem('token')
						}
				});

				socket.io.on("reconnect", async(attempt) => {
					console.log("reconnect");
					const [classList, codeList, resInfoCode, firstCandles, secondCandles] = await SocketService.getFirstParam(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe, chartState.secondTimeframe);
					await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);
					await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.secondTimeframe);

					store.dispatch(setClasses(classList.split(',').slice(0,-1)));
					store.dispatch(setCodes(codeList.split(',').slice(0,-1)))
					store.dispatch(setInfoCode(resInfoCode));
					store.dispatch(setFirstCandles(firstCandles));
					store.dispatch(setSecondCandles(secondCandles));
					store.dispatch(setLoad(true));
				});

				socket.on('newCandle', data => {
					data.interval === chartState.firstTimeframe ?
					store.dispatch(updateFirstCandle(data.candle)) :
					data.interval === chartState.secondTimeframe ?
					store.dispatch(updateSecondCandle(data.candle)) : console.log();
				})

				socket.on('updateCandle', data => {
					data.interval === chartState.firstTimeframe ?
					store.dispatch(updateFirstCandle(data.candle)) :
					data.interval === chartState.secondTimeframe ?
					store.dispatch(updateSecondCandle(data.candle)) : console.log();
				})

				socket.on('connectedQuik', async(connected) => {
					if(connected) {
						if(store.getState().user.errorSocket !== '') {
							const [classList, codeList, resInfoCode, firstCandles, secondCandles] = await SocketService.getFirstParam(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe, chartState.secondTimeframe);
							await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);
							await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.secondTimeframe);

							store.dispatch(setClasses(classList.split(',').slice(0,-1)));
							store.dispatch(setCodes(codeList.split(',').slice(0,-1)))
							store.dispatch(setInfoCode(resInfoCode));
							store.dispatch(setFirstCandles(firstCandles));
							store.dispatch(setSecondCandles(secondCandles));
							store.dispatch(setLoad(true));
						}

						store.dispatch(setErrorSocket(''));
					} else {
						store.dispatch(setErrorSocket('The server is not connected to QUIK'));
						store.dispatch(setLoad(false));
					}
				})
			
				socket.on("connect", async() => {
					const [classList, codeList, resInfoCode, firstCandles, secondCandles] = await SocketService.getFirstParam(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe, chartState.secondTimeframe);
					await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);
					await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.secondTimeframe);

					store.dispatch(setClasses(classList.split(',').slice(0,-1)));
					store.dispatch(setCodes(codeList.split(',').slice(0,-1)))
					store.dispatch(setInfoCode(resInfoCode));
					store.dispatch(setFirstCandles(firstCandles));
					store.dispatch(setSecondCandles(secondCandles));
					store.dispatch(setLoad(true));
				});

				// ???????????????????????? ?????????????????? ??????????????????
				socket.on("data", (messages: any) => {
					console.log(messages);
				})
				break;
			case 'chart/setSelectCode':
				(async function() {
					const resInfoCode = await SocketService.getSecurityInfo(socket, chartState.selectClass, action.payload);
					const firstCandles = await SocketService.getCandlesFromDataSource(socket, chartState.selectClass, action.payload, chartState.firstTimeframe, 3000);
					const secondCandles = await SocketService.getCandlesFromDataSource(socket, chartState.selectClass, action.payload, chartState.secondTimeframe, 3000);
					await SocketService.unsubscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);
					await SocketService.unsubscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.secondTimeframe);
					await SocketService.subscribeToCandles(socket, chartState.selectClass, action.payload, chartState.firstTimeframe);
					await SocketService.subscribeToCandles(socket, chartState.selectClass, action.payload, chartState.secondTimeframe);

					store.dispatch(setFirstCandles(firstCandles));
					store.dispatch(setSecondCandles(secondCandles));
					store.dispatch(setInfoCode(resInfoCode));
				})()
				break;
			case 'user/setAuth':
				if(action.payload === true) {
					store.dispatch({type: 'CONNECT'});
				}else{
					if(socket != null) {
						socket.close();
					}
				}
				break;
			case 'chart/setFirstTimeframe':
				(async function() {
					const firstCandles = await SocketService.getCandlesFromDataSource(socket, chartState.selectClass, chartState.selectCode, action.payload, 3000);
					await SocketService.unsubscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);
					console.log('...')
					await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, action.payload);

					store.dispatch(setFirstCandles(firstCandles));
				})()
				break;
			case 'chart/setSecondTimeframe':
				(async function() {
					const secondCandles = await SocketService.getCandlesFromDataSource(socket, chartState.selectClass, chartState.selectCode, action.payload, 3000);
					await SocketService.unsubscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.secondTimeframe);
					console.log('...')
					await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, action.payload);

					store.dispatch(setSecondCandles(secondCandles));
				})()
				break;
		}
    
		return next(action);
	}
}


