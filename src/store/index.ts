import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
//import  { Middleware, MiddlewareAPI, Dispatch } from "redux";
import chartReducer from './chartSlice';
import userReducer from './userSlice';
import { socketMiddleware } from './middleware/socketMiddleware';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';



const rootReducer = combineReducers({ chart: chartReducer, user: userReducer});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware()).concat(localStorageMiddleware()),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
export { selectUserState, setUser, setAuth, setLoad, setErrorSocket } from './userSlice';
export {selectChartState,
        selectChartClasses,
        selectChartSelectClass,
        selectChartCodes,
        selectChartSelectCode,
        selectChartFirstCandles,
        selectChartSecondCandles,
        selectChartFirstTimeframe,
        selectChartSecondTimeframe,
        setClasses,
        setSelectClass,
        setCodes,
        setSelectCode,
        setInfoCode,
        setFirstCandles,    
        setSecondCandles,
        setFirstTimeframe,
        setSecondTimeframe} from './chartSlice';
export type { candleType, ICandles, colorCandles, InfoCode } from './chartSlice';
export { useAppDispatch, useAppSelector } from './hooks';

