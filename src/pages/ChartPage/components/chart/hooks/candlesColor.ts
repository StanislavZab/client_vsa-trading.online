// этот Хук расскрашивает в определенный цвет свечи с объёмом больше чем два предыдущих (усилие) 

import { candleType } from "store";
import { useMemo } from "react";


const useCandlesColor = (candlesArray: candleType[], candles: candleType[], start: number) => {
    const candlesColor = useMemo<{candleColor: string, volumeColor: string}[]>(() => {
        if(candlesArray){
            return candles.map((item, index) => {
                const indexCandleArr = start + index;
                if(indexCandleArr < 2){
                    return {candleColor: 'black', volumeColor: 'black'};
                }else{
                    return  (item.volume > candlesArray[indexCandleArr - 1].volume && item.volume > candlesArray[indexCandleArr - 2].volume) ? 
                            {candleColor: 'black', volumeColor: 'black'} : 
                            {candleColor: 'black', volumeColor: 'grey'};
                }
            })
        }
        return []
    }, [candlesArray, candles, start]);

    return candlesColor;
}

export default useCandlesColor;
