import { io, Socket } from "socket.io-client";
import { Middleware } from 'redux';
import { RootState} from '../../store';
import { setFirstCandles, setClasses, setCodes, setInfoCode, addFirstCandle, updateFirstCandle } from '../chartSlice';
import { setErrorSocket, setLoad } from "store/userSlice";
import { ClientToServerEvents, ServerToClientEvents } from "models/ISocket";
import SocketService from "service/socket-service";


export const socketMiddleware = (): Middleware<{}, RootState> => {
	let socket: Socket<ClientToServerEvents, ServerToClientEvents>;
	const SERVER_URL = 'http://' + window.location.host.split(':')[0] + ':7000'


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

				socket.on('newCandle', data => {
					//console.log('newCandle', data);
					store.dispatch(addFirstCandle(data.candle))
				})

				socket.on('updateCandle', data => {
					//console.log('updateCandle', data);
					store.dispatch(updateFirstCandle(data.candle))
				})

				socket.on('connectedQuik', async(connected) => {
					if(connected) {
						if(store.getState().user.errorSocket !== '') {
							const [classList, codeList, resInfoCode, firstCandles] = await SocketService.getFirstParam(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);
							await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);

							store.dispatch(setClasses(classList.split(',').slice(0,-1)));
							store.dispatch(setCodes(codeList.split(',').slice(0,-1)))
							store.dispatch(setInfoCode(resInfoCode));
							store.dispatch(setFirstCandles(firstCandles));
							store.dispatch(setLoad(true));
						}

						store.dispatch(setErrorSocket(''));
					} else {
						store.dispatch(setErrorSocket('The server is not connected to QUIK'));
						store.dispatch(setLoad(false));
					}
				})
			
				socket.on("connect", async() => {
					const [classList, codeList, resInfoCode, firstCandles] = await SocketService.getFirstParam(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);
					await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);

					store.dispatch(setClasses(classList.split(',').slice(0,-1)));
					store.dispatch(setCodes(codeList.split(',').slice(0,-1)))
					store.dispatch(setInfoCode(resInfoCode));
					store.dispatch(setFirstCandles(firstCandles));
					store.dispatch(setLoad(true));
				});

				// обрабатываем получение сообщений
				socket.on("data", (messages: any) => {
					console.log(messages);
				})
				break;
			case 'chart/setSelectCode':
				(async function() {
					const resInfoCode = await SocketService.getSecurityInfo(socket, chartState.selectClass, action.payload);
					const firstCandles = await SocketService.getCandlesFromDataSource(socket, chartState.selectClass, action.payload, chartState.firstTimeframe, 3000);
					await SocketService.unsubscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);
					await SocketService.subscribeToCandles(socket, chartState.selectClass, action.payload, chartState.firstTimeframe);

					store.dispatch(setFirstCandles(firstCandles));
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
					const resInfoCode = await SocketService.getSecurityInfo(socket, chartState.selectClass, chartState.selectCode);
					const firstCandles = await SocketService.getCandlesFromDataSource(socket, chartState.selectClass, chartState.selectCode, action.payload, 3000);
					await SocketService.unsubscribeToCandles(socket, chartState.selectClass, chartState.selectCode, chartState.firstTimeframe);
					console.log('...')
					await SocketService.subscribeToCandles(socket, chartState.selectClass, chartState.selectCode, action.payload);

					store.dispatch(setFirstCandles(firstCandles));
					store.dispatch(setInfoCode(resInfoCode));
				})()
				break;
		}
    
		return next(action);
	}
}


