import { NavLink } from "react-router-dom";
import {showGraphType} from '../../types'
import { selectChartFirstTimeframe, selectChartSecondTimeframe, setAuth, setFirstTimeframe, setSecondTimeframe, setUser, useAppDispatch, useAppSelector } from 'store';
import { selectChartClasses, selectChartSelectClass, selectChartCodes, selectChartSelectCode, setSelectCode, setSelectClass } from "store";
import AuthService from "service/auth-service";
import { IUser } from "models/IUser";

interface toolsBarPageProps {
    isMinWidth: boolean,
    showGraph: showGraphType,
    setShowGraph: (value: React.SetStateAction<showGraphType>) => void,
}

const timeframes = [
    {label:'1м',value:1},
    {label:'2м',value:2},
    {label:'3м',value:3},
    {label:'4м',value:4},
    {label:'5м',value:5},
    {label:'10м',value:10},
    {label:'15м',value:15},
    {label:'20м',value:20},
    {label:'30м',value:30},
    {label:'1ч',value:60},
    {label:'1д',value:1440}
]

const ToolsBarPage: React.FC<toolsBarPageProps> = ({ 
        isMinWidth, 
        showGraph,  
        setShowGraph,  
    }) => {

    const classes  = useAppSelector(selectChartClasses);
    const selectClass = useAppSelector(selectChartSelectClass);
    const codes  = useAppSelector(selectChartCodes);
    const selectCode = useAppSelector(selectChartSelectCode);
    const firstTimeframe = useAppSelector(selectChartFirstTimeframe);
    const secondTimeframe = useAppSelector(selectChartSecondTimeframe);
    const dispatch = useAppDispatch();

    const logout = async () => {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            dispatch(setAuth(false));
            dispatch(setUser({} as IUser));
            console.log(response);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    return(
        <>
            <select value={selectCode} onChange={e => {localStorage.setItem('code', e.target.value);dispatch(setSelectCode(e.target.value))}}>
                {
                    codes.map(code => {
                        return <option key={code} value={code}>{code}</option>
                    })
                }
            </select>
            <input type='radio' checked={showGraph === 'leftGraph'} name='graph' id='graph1' onChange={() => setShowGraph('leftGraph')}></input>
            <input type='radio' checked={showGraph === 'rightGraph'} name='graph' id='graph2' onChange={() => setShowGraph('rightGraph')}></input>
            {isMinWidth && <input type='radio' checked={showGraph === 'twoGraphs'} name='graph' id='graph3' onChange={() => setShowGraph('twoGraphs')}></input>}
            {(showGraph === 'leftGraph' || showGraph === 'twoGraphs') && <select value={firstTimeframe} onChange={e => dispatch(setFirstTimeframe(Number(e.target.value)))} >
                {timeframes.map(item => <option key={'1'+item.label} value={item.value}>{item.label}</option>)}
            </select>}
            {(showGraph === 'rightGraph' || showGraph === 'twoGraphs') && <select value={secondTimeframe} onChange={e => dispatch(setSecondTimeframe(Number(e.target.value)))} >
                {timeframes.map(item => <option key={'2'+item.label} value={item.value}>{item.label}</option>)}
            </select>}
            <button onClick={logout}>Выйти</button>
        </>
    )
}

export default ToolsBarPage;