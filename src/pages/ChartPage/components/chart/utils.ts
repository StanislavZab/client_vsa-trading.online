import { candleType } from "store";



export function drawVerticalLine(ctx: CanvasRenderingContext2D|null, x: number, y1: number, y2: number, widthLine: number = 1, color: string = "#000"): void {
    const x1 = x - Math.ceil(widthLine / 2) + 1;
    if(ctx){
        ctx.fillStyle = color;
        ctx.fillRect(x1, y1, widthLine, y2 - y1);
    }
}

export function drawHorizontalLine(ctx: CanvasRenderingContext2D|null, x: number, y: number, w: number, h: number = 1, color: string = "#000"): void {
    const y1 = y - Math.ceil(h / 2) + 1;
    if(ctx){
        ctx.fillStyle = color;
        ctx.fillRect(x, y1, w, h);
    }
}

export function clear(ctx: CanvasRenderingContext2D|null, width: number, height: number): void {
    ctx && ctx.clearRect(0, 0, width, height);
}

export function drawCandle(ctx: CanvasRenderingContext2D|null,x: number,data:candleType,height: number,xRatio: number,yRatio: number,min: number,padding: number,color: string){
    const highY = Math.round(height - (yRatio * (data.high - min)) - padding);
    const lowY = Math.round(height - (yRatio * (data.low - min)) - padding);
    const openY = Math.round(height - (yRatio * (data.open - min)) - padding);
    const closeY = Math.round(height - (yRatio * (data.close - min)) - padding);
    const widthLine = (xRatio / 3 < 1) ? 1 : Math.round(xRatio / 3);
    const widthLineOpenClose = Math.round(xRatio / 2.5);

    drawVerticalLine(ctx, x, highY, lowY, widthLine, color);
    drawHorizontalLine(ctx, x + Math.ceil(widthLine / 2), openY, -widthLineOpenClose - Math.floor(widthLine / 2), widthLine, color);
    drawHorizontalLine(ctx, x - Math.ceil(widthLine / 2) + 1, closeY, widthLineOpenClose + Math.floor(widthLine / 2), widthLine, color);
    //console.log(highY,lowY,openY,closeY,widthLineOpenClose, padding);
}

export function drawVolume(ctx: CanvasRenderingContext2D|null,x: number,data:candleType,height: number,xRatio: number,yRatio: number,color: string){
    const yMax = Math.round(yRatio * data.volume)
    const widthLine = (xRatio / 3 < 1) ? 1 : Math.round(xRatio / 1.5);
    drawVerticalLine(ctx, x, height - yMax, height, widthLine, color);
}

export function calcMin(data: number[]): number {
    //расчет минимума цены в выбраном интервале времени
    return Math.min.apply(null, data);
}

export function calcMax(data: number[]): number {
    //расчет минимума цены в выбраном интервале времени
    return Math.max.apply(null, data);
}

export function calcMaxVolume(data: number[]): number {
    //расчет минимума цены в выбраном интервале времени
    return Math.max.apply(null, data);
}

export function calcYRatio(height: number, padding: number, min: number, max: number): number {
    return  (height - padding * 2) / (max - min);
}

export function calcXRatio(width: number, length: number): number {
  return width / length;
}

function calcGridPitch(yRatio: number, stepPrice: number, minHeightGrid: number, stepGridPitch: number[]): number {
    let gridPitch = stepPrice;
    let index = 0;
    let dec = 1;
    while (minHeightGrid > gridPitch * yRatio) {
        gridPitch = stepPrice * dec * stepGridPitch[index];
        index++;
        if(index >= stepGridPitch.length){
            index = 0;
            dec = dec * 10;
        }
    }
    return gridPitch;
}

export function calcYAxisLabel(min: number, max: number, padding: number, yRatio: number, stepPrice: number, minHeightGrid: number, stepGridPitch: number[]): number[] {
    const gridPitch = calcGridPitch(yRatio,stepPrice,minHeightGrid,stepGridPitch);
    const priceUp = max - max % gridPitch;
    let arr = [];
    if(priceUp + gridPitch < max + padding / yRatio){arr.push(priceUp + gridPitch)}
    arr.push(priceUp);
    let temp = priceUp;
    while(temp > min - padding - 12 / yRatio){
        temp = temp - gridPitch;
        if(temp > min - padding - 12 / yRatio){
            arr.push(temp);
        }
    }
    return arr;
}

export function calcCrossPrice(yRatio: number,max: number,padding: number,y: number, stepPrice: number): number {
    return Math.round((max - (y - padding) / yRatio) / stepPrice) * stepPrice
}

export function calcXCenterBar(x: number,xRatio: number){
    return (Math.floor(Math.floor(x / xRatio) * xRatio + (xRatio / 2)))
}

export function addTimeInArray(arrTime: number[], timeFrame: number, count: number): number[] {

    //1) проверяем какой день. Если выходной, то выставляем время следующего понедельника 7:00
    //   Если не выходной, то смотрим какой ТФ. 
    //2) Если ТФ дневной (>= 1440 минут), то просто пушим.
    //3) Если ТФ >= 60 минут, но < 1440 минут, то проверяем >= 7 часов или нет.
    //   Если больше, то прибавляем ТФ. 
    //   Если меньше, то переводим время на 7:00 следующего дня.
    //4) Если ТФ минутный ( < 60 минут), то проверяем

    let tempTime = arrTime[arrTime.length - 1];
    for (let i = 1; i <= count; i++) {
        const nextTime = new Date((tempTime + timeFrame * 60) * 1000); // следующяя временная метка в миллисекундах
        //console.log(nextTime.getDay(),nextTime.getDate())
        if(nextTime.getDay() < 1 || nextTime.getDay() > 5){
            //console.log(1)
            const date = nextTime.getDate(); 
            nextTime.setDate(date + 2);
            nextTime.setHours(7,0,0,0);
            tempTime = nextTime.getTime() / 1000;
        }else{
            if(nextTime.getHours() >= 7 && timeFrame < 1440){
                //console.log(2)
                if(timeFrame < 60 && nextTime.getHours() === 23 && nextTime.getMinutes() >= 50){
                    const date = nextTime.getDate(); 
                    nextTime.setDate(date + 1);
                    nextTime.setHours(7,0,0,0);
                    tempTime = nextTime.getTime() / 1000;
                }else{
                    //console.log(4)
                    tempTime = nextTime.getTime() / 1000;
                }
            }else{
                //console.log(5)
                nextTime.setHours(7,0,0,0);
                tempTime = nextTime.getTime() / 1000;
            }
        }

        //console.log(tempTime,nextTime.getTime() / 1000)
        arrTime.push(tempTime);
    }
    return arrTime;
}
