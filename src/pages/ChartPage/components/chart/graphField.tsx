import { candleType } from "store";
import React, { useMemo } from "react";
import useDrawChart from "./hooks/drawChart";
import style from './style.module.css'

interface graphFieldProps{
    children?: React.ReactNode,
    point: {x: number, y: number, candleIndex: number}
    width: number,
    height: number,
    heightVolume: number, 
    min: number, 
    max: number, 
    xRatio: number,
    yRatio: number,
    maxVolume: number,
    yRatioVolume: number,
    padding: number,
    sliceCandles: candleType[],
    candlesColor:{
        candleColor: string;
        volumeColor: string;
    }[],
    countCandles: number,
}

const GraphField: React.FC<graphFieldProps> = ({
        point,
        width, 
        height, 
        heightVolume,
        min, 
        max, 
        xRatio, 
        yRatio,
        maxVolume,
        yRatioVolume,
        padding,
        sliceCandles, 
        candlesColor, 
        countCandles
}, ...props) => {
    
    const canvasRef = useDrawChart(
        width, 
        height, 
        heightVolume, 
        min, 
        xRatio, 
        yRatio,
        maxVolume,
        yRatioVolume,
        padding, 
        sliceCandles, 
        candlesColor, 
        countCandles);
    
    const curPriceY = useMemo(() => {
        return Math.round((max - sliceCandles[sliceCandles.length - 1]?.close) * yRatio + padding);
    }, [sliceCandles])

    const displayCurrentY = useMemo(() => ({
        display: curPriceY >= 0 ? 'block' : 'none',
        top: curPriceY + 'px',
        width: width + 'px',
    }), [curPriceY, width])
        
    const displayCrossHairY = useMemo(() => ({
        display: point.y >= 0 ? 'block' : 'none',
        top: point.y + 'px',
        width: width + 'px',
    }), [point.y, width])

    const displayCrossHairX = useMemo(() => ({
        display: point.y >= 0 ? 'block' : 'none',
        height: height + 'px',
        left: point.x + 'px',
    }), [point.x, point.y, height])
    
    return(
        <div style={{position:'relative'}}>
            <canvas ref={canvasRef} width={width} height={height} style={{height: height+'px'}} ></canvas>
            <div className={style.currentPriceY} style={displayCurrentY}></div>
            <div className={style.crossHairLineX} style={displayCrossHairX}></div>
            <div className={style.crossHairLineY} style={displayCrossHairY}></div>
        </div>

    )
}

export default GraphField;