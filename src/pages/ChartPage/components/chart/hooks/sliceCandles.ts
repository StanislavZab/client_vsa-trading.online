import { candleType, ICandles } from "store";
import { useMemo } from "react";
import useCandlesColor from "./candlesColor";


const useSliceCandles = (data: ICandles, start: number, end: number) => {

    const candles = useMemo<candleType[]>(() => {
        return data?.candles?.slice(start, end);
    }, [data, start, end]);

    const candlesColor = useCandlesColor(data?.candles, candles, start);

    return {candles, candlesColor};
}

export default useSliceCandles;