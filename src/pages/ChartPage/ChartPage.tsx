import { useAppDispatch, useAppSelector } from "store";
import React, { useEffect, useRef, useState } from "react";
import Chart from "./components/chart/chart";
import ToolsBarPage from "./components/toolsBarPage/toolsBarPage";
import { showGraphType } from "./types";
import { selectChartFirstDataGraph, selectChartSecondDataGraph, selectChartSelectClass, selectChartSelectCode } from "store/chartSlice";

import style from './style.module.css';


interface ChartPageProps{
	width: number,
	height: number,
}


const ChartPage: React.FC<ChartPageProps> = ({width, height}) => {
	//console.log('ChartPage render')
	const class_code = useAppSelector(selectChartSelectClass);
	const sec_code = useAppSelector(selectChartSelectCode);
	const {firstCandles, firstTimeframe} = useAppSelector(selectChartFirstDataGraph);
	const {secondCandles, secondTimeframe} = useAppSelector(selectChartSecondDataGraph);
	//const dispatch = useAppDispatch();
	const divRef = useRef<HTMLDivElement>(null);
	
	const [leftWidthField, setLeftWidthField] = useState<number>(Math.round(Number(localStorage.getItem('widthLeftChart') || '50') * width / 100));
	const [showGraph, setShowGraph] = useState<showGraphType>((localStorage.getItem('showGraph') || 'leftGraph') as showGraphType);
	
	useEffect(() => {
		function onMouseDown(e: MouseEvent){
			function onMouseUp(e: MouseEvent){
				e.preventDefault();
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
			}
	
			function onMouseMove(e: MouseEvent){
				e.preventDefault();
				const w = e.clientX < 100 ? 100 : e.clientX > document.documentElement.offsetWidth - 100 ? document.documentElement.offsetWidth - 100: e.clientX;
				setLeftWidthField(w);
				localStorage.setItem('widthLeftChart', `${w / (width / 100)}`);
			}

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		}
		divRef.current?.addEventListener('mousedown', onMouseDown);
		return () => {
			divRef.current?.removeEventListener('mousedown', onMouseDown);
		}
	}, [divRef.current]) 

	useEffect(() => {
		setLeftWidthField(Math.round(Number(localStorage.getItem('widthLeftChart') || '50') * width / 100));
	}, [width])

	useEffect(() => {
		if(showGraph !== 'twoGraphs'){
			setLeftWidthField(Math.round(width));
		}else{
			setLeftWidthField(Math.round(Number(localStorage.getItem('widthLeftChart') || '50') * width / 100));
		}
		localStorage.setItem('showGraph', showGraph);
	}, [showGraph]);

	
    return(
		<div className={style.mainWrapper}>
			<article className={style.toolBar}>
				<ToolsBarPage 
					isMinWidth={true}
					showGraph={showGraph}
					setShowGraph={setShowGraph}
				/>
			</article>
			<article className={style.charts}>
				{(showGraph === 'leftGraph' || showGraph === 'twoGraphs') &&
					<div className={style.leftChart} style={{width: leftWidthField}} >
						<Chart 
							name={'leftGraph'} 
							data={firstCandles}
							code={sec_code} 
							timeframe={firstTimeframe} 
							width={leftWidthField} 
							height={height - 25} 
						/>
					</div>
				}
				{showGraph === 'twoGraphs' && 
					<div ref={divRef} className={style.splitter} ></div>
				}
				{(showGraph === 'rightGraph' || showGraph === 'twoGraphs') &&
					<div className={style.rightChart}>
						<Chart 
							name={'rightGraph'} 
							data={secondCandles}
							code={sec_code} 
							timeframe={secondTimeframe} 
							width={showGraph === 'twoGraphs' ? width - leftWidthField - 3 : width} 
							height={height - 25} 
						/>
					</div>
				}
			</article>
		</div>
    )
}
//<Chart width={leftWidthField} height={height - 20} name={'leftGraph'} candles={leftCandles as ICandles} />
//<Chart width={width - leftWidthField - 3} height={height - 20} name={'rightGraph'} candles={rightCandles as ICandles} />
export default React.memo(ChartPage);