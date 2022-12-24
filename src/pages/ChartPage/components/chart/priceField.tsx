import { candleType } from "store/chartSlice";
import React, { useEffect, useMemo, useRef } from "react";

import style from './style.module.css';
import { calcCrossPrice, calcYAxisLabel, clear, drawHorizontalLine } from "./utils";

interface priceFieldProps {
    width: number,
    height: number,
    y: number,
    heightVolume: number,
    yRatio: number,
    yRatioVolume: number,
    min: number,
    max: number,
    maxVolume: number,
    padding: number,
    stepPrice: number,
    data: candleType[]
}

const PriceField: React.FC<priceFieldProps> = ({width, height, y, heightVolume, yRatio, yRatioVolume, min, max, maxVolume, padding, stepPrice, data}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const price = useMemo(() => {
        if(y < height - heightVolume){
            return calcCrossPrice(yRatio, max, padding, y, stepPrice);
        }else{
            return Math.round((height - y) / yRatioVolume);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [y, yRatioVolume])

    const curPriceY = useMemo(() => {
        return Math.round((max - data[data.length - 1]?.close) * yRatio + padding);
    }, [data])

    const yAxisLabel = useMemo<number[]>(() => {
        return calcYAxisLabel(min, max, padding, yRatio, stepPrice, 50, [1,2,4,5,8]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [min, max, yRatio]);

    useEffect(() => {
        const ctx = canvasRef.current && canvasRef.current.getContext('2d');
        clear(ctx,width,height);

        if(ctx) {
            yAxisLabel.forEach(item => {
                const y = (max - item) * yRatio + padding;
                drawHorizontalLine(ctx, 0, y, 5, 2, 'black');
                const yText = (y + 6 < 6) ? 6 : (y + 6 > height) ? height - 6 : y + 6;
                ctx.font = "bold 12px Arial";
                ctx.fillText(item.toString(),5,yText)
            })
            const y = height - heightVolume;
            drawHorizontalLine(ctx, 0, y, 5, 2, 'black');
            drawHorizontalLine(ctx, 0, y + heightVolume / 2, 5, 2, 'black');
            ctx.font = "bold 12px Arial";
            ctx.fillText(String(maxVolume),5,y + 6)
            ctx.fillText(String(Math.round(maxVolume/2)),5,y + heightVolume / 2 + 6)
        }
    }, [width, height, yRatio, yRatioVolume, min, max, padding])

    const displayCrossHairPrice = useMemo(() => ({
        display: (y >= 0 && y <= height) ? 'flex' : 'none',
        top: (y - 10 < 0) ? '0px' : (y + 10 > height) ? height - 20 + 'px' : y - 10 + 'px',
    }), [y, height])

    const displayCurrentPrice = useMemo(() => ({
        display: (curPriceY >= 0 && curPriceY <= height) ? 'flex' : 'none',
        top: (curPriceY - 10 < 0) ? '0px' : (curPriceY + 10 > height) ? height - 20 + 'px' : curPriceY - 10 + 'px',
        backgroundColor: '#000'
    }), [curPriceY, height])

    return(
        <>
           <canvas ref={canvasRef} width={50} height={height} ></canvas>
           <div className={style.priceLabel} style={displayCurrentPrice} >{data[data.length - 1]?.close}</div>
           <div className={style.priceLabel} style={displayCrossHairPrice} >{price}</div>
           
        </>
    )
}

export default PriceField;