import { useRef, useState } from "react";


const useGraphFieldEvents = (
    width: number, 
    xRatio: number,
    yRatio: number,
    setXRatio: React.Dispatch<React.SetStateAction<number>>,
    setOffsetRight: React.Dispatch<React.SetStateAction<number>>,
    setManualMin: React.Dispatch<React.SetStateAction<number>>, 
    setManualMax: React.Dispatch<React.SetStateAction<number>>,
    autoClick: (flag: boolean) => void,
    ) => {
    const ref = useRef<HTMLDivElement>(null);
    const [point, setPoint] = useState<{x: number, y: number, candleIndex: number}>({x: -1, y: -1, candleIndex: 0}); //положение курсора на графике
    const [lastPoint, setLastPoint] = useState<{x: number, y: number}>({x: -1, y: -1});
    const [lastOffsetX, setLastOffsetX] = useState<number>(0);
    const [lastOffsetY, setLastOffsetY] = useState<number>(0);

    const onPointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        const rect = ref.current?.getBoundingClientRect();
        const x = e.clientX - rect.x;
        const y = e.clientY - rect.y;
        if(e.pointerType === 'mouse'){
            if(e.buttons === 1){
                setPoint({x: -1, y: -1, candleIndex: 0});
                setLastPoint({x, y});
                setLastOffsetX(0);
                setLastOffsetY(0);

            }
        }else{

        }
    }

    const onPointerUp = (e: React.PointerEvent) => {
        e.preventDefault();
        const rect = ref.current?.getBoundingClientRect();
        const x = e.clientX - rect.x;
        const y = e.clientY - rect.y;
        const xx = width - (Math.floor((width - x) / xRatio) * xRatio + xRatio / 2);
        const candleIndex = Math.floor(xx / xRatio);
        setPoint({x: candleIndex < 0 ? -1 : xx, y: candleIndex < 0 ? -1 : y, candleIndex});
    }

    const onPointerLeave = (e: React.PointerEvent) => {
        e.preventDefault();
        setPoint({x: -1, y: -1, candleIndex: 0});
        setLastPoint({x: -1, y: -1});
    }

    const onPointerMove = (e: React.PointerEvent) => {
        e.preventDefault();
        const rect = ref.current?.getBoundingClientRect();
        const x = e.clientX - rect.x;
        const y = e.clientY - rect.y;
        if(rect){
            if(e.pointerType === 'mouse'){
                if(e.buttons === 0){
                    const xx = width - (Math.floor((width - x) / xRatio) * xRatio + xRatio / 2);
                    const candleIndex = Math.floor(xx / xRatio);
                    setPoint({x: candleIndex < 0 ? -1 : xx, y: candleIndex < 0 ? -1 : y, candleIndex});
                }else if(e.buttons === 1 && lastPoint.x !== -1){
                    if(Math.abs(lastPoint.x - x) > 20){
                        const offsetX = Math.floor((lastPoint.x - x) / xRatio);
                        if(offsetX !== lastOffsetX){
                            setLastOffsetX(offsetX);
                            setOffsetRight(last => last + offsetX - lastOffsetX)
                        }
                    }
                    if(Math.abs(lastPoint.y - y) > 20){
                        const offsetY = Math.round((lastPoint.y - y) / yRatio);
                        if(offsetY !== lastOffsetY){
                            autoClick(false);
                            setLastOffsetY(offsetY);
                            setManualMin(last => last - (offsetY - lastOffsetY));
                            setManualMax(last => last - (offsetY - lastOffsetY));
                        }
                    }
                }
            }else{

            }
        }
    }

    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('onContextMenu')
    }

    const onWheel = (e: React.WheelEvent) => {
        const deltaXRatio = xRatio + xRatio * 10 / e.deltaY;
        setXRatio(deltaXRatio < 1 ? 1 : deltaXRatio > 50 ? 50 : deltaXRatio);
    }
  

    return {
        point,
        ref,
        // onClick,
        // onDoubleClick,
         onPointerMove,
        // onMouseOver,
        onPointerLeave,
        onPointerDown,
        onPointerUp,
        onContextMenu,

        onWheel,

        // onTouchCancel,
        // onTouchEnd,
        // onTouchMove,
        // onTouchStart
    }
}

export default useGraphFieldEvents;
