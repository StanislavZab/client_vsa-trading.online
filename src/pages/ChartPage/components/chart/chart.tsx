import { useEffect, useMemo, useState } from "react";
import { ICandles, useAppSelector } from "store";
import GraphField from "./graphField";
import { calcMax, calcMaxVolume, calcMin, calcYRatio } from "./utils";
import PriceField from "./priceField";
import useSliceCandles from "./hooks/sliceCandles";
import useGraphFieldEvents from "./hooks/graphFieldEvents";

import style from './style.module.css'
import { selectChartFirstDataGraph, selectChartInfoCode } from "store/chartSlice";


interface chartProps {
    name: string,
    data: ICandles,
    code: string,
    timeframe: number,
    width: number,
    height: number
}

const Chart: React.FC<chartProps> = ({name, data, code, timeframe, width, height}) => {
    //const {firstCandles,firstTimeframe} = useAppSelector(selectChartFirstDataGraph);
    const firstCandles = data;
    const infoCode = useAppSelector(selectChartInfoCode);
    
    const [autoPriceScale, setAutoPriceScale] = useState<boolean>(true);                                             //флаг авторасчета диапазона цены
    const [manualMin, setManualMin] = useState<number>(0);                                                           //ручная установка минимума цены
    const [manualMax, setManualMax] = useState<number>(0);                                                           //ручная установка максимума цены
    const [xRatio, setXRatio] = useState<number>(10);                                                                //расстояние между свечами
    const [countCandles, setCountCandles] = useState<number>(Math.ceil(Number(((width - 50) / xRatio).toFixed(0)))); //количество свечей на графике
    const [firstCandle, setFirstCandle] = useState<number>(0);                                                       //индекс первой свечи на графике
    const [offsetRight, setOffsetRight] = useState<number>(0);                                                       //смещение графика справа

    const autoClick = (flag: boolean) => {
        if(flag){
            setAutoPriceScale(flag);
        }else{
            setAutoPriceScale(flag);
            setManualMin(min);
            setManualMax(max);
        }
        
    }

    
    useEffect(() => {
        setOffsetRight(0);
        setAutoPriceScale(true);
    }, [code])
    
    useEffect(() => {
        setFirstCandle(firstCandles ? firstCandles.candles.length - countCandles -  offsetRight : 0);
    }, [firstCandles])

    useEffect(() => {
        if(firstCandles){
            let first = firstCandles.candles.length - countCandles + offsetRight;
            if(first > firstCandles.candles.length - 1){
                first = firstCandles.candles.length - 1;
                setOffsetRight(countCandles - 1);
            }else{
                if(first < 0){
                    first = 0;
                    //setOffsetRight(countCandles - data.candles.length);
                }
            }
            setFirstCandle(first);
        }
    }, [offsetRight, countCandles, firstCandles])

    useEffect(() => {
        setFirstCandle( prevState => {
            return prevState + countCandles - Math.ceil(Number(((width - 50) / xRatio).toFixed(0)));
        })
        setCountCandles(Math.ceil(Number(((width - 50) / xRatio).toFixed(0))));
    }, [width, xRatio])

    const {candles, candlesColor} = useSliceCandles(firstCandles, firstCandle, firstCandle + countCandles);

    const heightVolume = useMemo(() => (height - 20) * 0.1, [height]);
    
    const min = useMemo(() => autoPriceScale ? calcMin(candles?.map(candle => candle.low)) : manualMin, [autoPriceScale, candles, manualMin]);

    const max = useMemo(() => autoPriceScale ? calcMax(candles?.map(candle => candle.high)) : manualMax, [autoPriceScale, candles, manualMax]);

    const yRatio = useMemo(() => calcYRatio(height - heightVolume - 20, 80, min, max), [height, heightVolume, min, max]);

    const maxVolume = useMemo(() => calcMaxVolume(candles?.map(candle => candle.volume)), [candles]);

    const yRatioVolume = useMemo<number>(() => calcYRatio(heightVolume,0,0,maxVolume), [maxVolume, heightVolume]);

    const {
        point,
        ...eventGraph
    } = useGraphFieldEvents(
        width - 51, 
        xRatio, 
        yRatio,
        setXRatio, setOffsetRight, 
        setManualMin, 
        setManualMax,
        autoClick
        );

    return(
        <section className={style.section}>
            <div className={style.rowGraphPriceAxis} >
                <div className={style.graph} style={{height: height - 20 + 'px'}} >
                    {firstCandles ? 
                        <>
                            <GraphField 
                                point={point}
                                width={width - 51} 
                                height={height - 21} 
                                heightVolume={heightVolume}
                                min={min}
                                max={max}
                                xRatio={xRatio} 
                                yRatio={yRatio}
                                maxVolume={maxVolume}
                                yRatioVolume={yRatioVolume}
                                padding={80}
                                sliceCandles={candles} 
                                candlesColor={candlesColor}
                                countCandles={countCandles}
                            />
                            <div {...eventGraph} style={{width: width - 51 + 'px', height: height - 21 + 'px', position: "absolute"}}></div>
                        </>
                        : 
                        <h1>Loading...</h1>
                    }
                </div>
                <div className={style.priceAxis} style={{height: height - 20 + 'px'}} >
                    {firstCandles ?
                        <PriceField
                            width={50}
                            height={height - 21}
                            y={point.y}
                            heightVolume={heightVolume}
                            yRatio={yRatio}
                            yRatioVolume={yRatioVolume}
                            min={min}
                            max={max}
                            maxVolume={maxVolume}
                            padding={80}
                            stepPrice={infoCode?.min_price_step}
                            data={candles}
                        />
                        :
                        <></>
                    }
                </div>
            </div>
            <div style={{display:'flex', flexGrow: '1', flexBasis: '20px'}}>
                <div className={style.rowTimeAxis} >
                    
                </div>
                <div style={{flexBasis: '50px', background: 'grey', color: autoPriceScale ? 'green' : 'red', fontSize: '14px', cursor: 'pointer'}} onClick={e => autoClick(!autoPriceScale)}>
                    {autoPriceScale ? 'Auto' : 'Manual'}
                </div>
            </div>
        </section>
    )
}

export default Chart;



