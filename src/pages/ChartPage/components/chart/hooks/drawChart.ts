// хук занимается отрисовкой графика

import { useEffect, useRef } from "react";
import { candleType } from "store";
import { drawCandle, drawVolume, clear } from '../utils'


const useDrawChart = (
    width: number,
    height: number,
    heightVolume: number,
    min: number,
    xRatio: number,
    yRatio: number,
    maxVolume: number,
    yRatioVolume: number,
    padding: number,
    sliceCandles: candleType[],
    candlesColor: {
        candleColor: string;
        volumeColor: string;
    }[],
    countCandles: number
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
		const ctx = canvasRef.current && canvasRef.current.getContext('2d');
        clear(ctx,width,height);

		sliceCandles?.forEach((candle, index) => {
            const x = Math.floor(((width - (countCandles * xRatio + xRatio / 2)) + xRatio * (index + 1)));
            drawVolume(ctx, x, candle, height, xRatio, yRatioVolume, candlesColor[index].volumeColor);
            drawCandle(ctx, x, candle, height - heightVolume + 1, xRatio, yRatio, min, padding, candlesColor[index].candleColor);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sliceCandles, width, height, canvasRef, xRatio, heightVolume, yRatio, min, padding, candlesColor, yRatioVolume])

    return canvasRef;
}


export default useDrawChart;

