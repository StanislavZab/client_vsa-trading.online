import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "store";


export const localStorageMiddleware = (): Middleware<{}, RootState> => {


	return store => next => action => {
        switch(action.type) {
			case 'chart/setSelectClass':
                localStorage.setItem('selectClass', action.payload);
                break;
            case 'chart/setSelectCode':
                localStorage.setItem('selectCode', action.payload);
                break;
            case 'chart/setFirstTimeframe':
                localStorage.setItem('firstTimeframe', action.payload);
                break;
            case 'chart/setSecondTimeframe':
                localStorage.setItem('secondTimeframe', action.payload);
                break;
        }

        return next(action);
    }
}