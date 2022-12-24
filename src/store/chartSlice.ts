import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

//тип описывающий свечу
export type candleType = {
    index: number,
    datetime: number,
    open: number,
    close: number,
    high: number,
    low: number,
    volume: number
};

// интерфейс хранящий в себе таймфрейм и свечи по этому таймфрейму
export interface ICandles{
    sec: string,
    class: string,
    interval: number,
    candles: candleType[]
}

export type InfoCode = {
    base_active_classcode: string,
    base_active_seccode: string,
    class_code: string,
    class_name: string,
    code: string,
    exp_date: number,
    mat_date: number,
    min_price_step: number,
    name: string,
    scale: number,
    sec_code: string,
    short_name: string,
}

export type colorCandles = {
    upCandle: string, 
    downCandle: string, 
    effortUpCandle: string, 
    effortDownCandle: string, 
    upVolume: string, 
    downVolume: string,
    effortUpVolume: string,
    effortDownVolume: string,
}

export interface IChartState{
    ioConnect: boolean,
    isLoading: 'idle' | 'peding' | 'success' | 'error',
    error?: string,
    classes: string[],
    codes: string[],
    selectClass: string,
    selectCode: string,
    infoCode?: InfoCode, 
    firstTimeframe: number,
    secondTimeframe: number,
    firstCandles?: ICandles,
    secondCandles?: ICandles,
}

const initialState: IChartState = {
    ioConnect: false,
    isLoading: 'idle',
    error: '',
    classes: [],
    codes: [],
    selectClass: localStorage.getItem('selectClass') || 'SPBFUT',
    selectCode: localStorage.getItem('selectCode') || 'RIH3',
    firstTimeframe: Number(localStorage.getItem('firstTimeframe') || 60),
    secondTimeframe: Number(localStorage.getItem('secondTimeframe') || 5),
}

export const chartSlice = createSlice({
    name: 'chart',
    initialState,
    reducers: {
        setClasses(state, action: PayloadAction<string[]>) {
            state.classes = action.payload;
        },
        setSelectClass(state, action: PayloadAction<string>) {
            state.selectClass = action.payload;
        },
        setCodes(state, action: PayloadAction<string[]>) {
            state.codes = action.payload;
        },
        setSelectCode(state, action: PayloadAction<string>) {
            state.selectCode = action.payload;
        },
        setInfoCode(state, action: PayloadAction<InfoCode>) {
            state.infoCode = action.payload;
        },
        setFirstCandles(state, action: PayloadAction<any>) {
            state.firstCandles = action.payload;
        },
        addFirstCandle(state, action: PayloadAction<any>) {
            state.firstCandles.candles.pop();
            state.firstCandles.candles.push(...action.payload);
        },
        addSecondCandle(state, action: PayloadAction<any>) {
            state.secondCandles.candles.pop();
            state.secondCandles.candles.push(...action.payload);
        },
        updateFirstCandle(state, action: PayloadAction<any>) {
            state.firstCandles.candles.pop();
            state.firstCandles.candles.push(action.payload);
        },
        updateSecondCandle(state, action: PayloadAction<any>) {
            state.secondCandles.candles.pop();
            state.secondCandles.candles.push(action.payload);
        },
        setSecondCandles(state, action: PayloadAction<any>) {
            state.secondCandles = action.payload;
        },
        setFirstTimeframe(state, action: PayloadAction<number>) {
            state.firstTimeframe = action.payload;
        },
        setSecondTimeframe(state, action: PayloadAction<number>) {
            state.secondTimeframe = action.payload;
        },
    }
})


export const selectChartState = (state: RootState) => state.chart;
export const selectChartClasses = (state: RootState) => state.chart.classes;
export const selectChartSelectClass = (state: RootState) => state.chart.selectClass;
export const selectChartCodes = (state: RootState) => state.chart.codes;
export const selectChartSelectCode = (state: RootState) => state.chart.selectCode;
export const selectChartInfoCode = (state: RootState) => state.chart.infoCode;
export const selectChartFirstCandles = (state: RootState) => state.chart.firstCandles;
export const selectChartSecondCandles = (state: RootState) => state.chart.secondCandles;
export const selectChartFirstTimeframe = (state: RootState) => state.chart.firstTimeframe;
export const selectChartSecondTimeframe = (state: RootState) => state.chart.secondTimeframe;
export const selectChartFirstDataGraph = (state: RootState) => ({
    firstCandles: state.chart.firstCandles,
    firstTimeframe: state.chart.firstTimeframe
});
export const selectChartSecondDataGraph = (state: RootState) => ({
    secondCandles: state.chart.secondCandles,
    secondTimeframe: state.chart.secondTimeframe
});

export const { 
    setClasses,
    setSelectClass,
    setCodes,
    setSelectCode,
    setInfoCode,
    setFirstCandles,    
    setSecondCandles,
    addFirstCandle,
    addSecondCandle,
    updateFirstCandle,
    updateSecondCandle,
    setFirstTimeframe,
    setSecondTimeframe
} = chartSlice.actions;

export default chartSlice.reducer;
