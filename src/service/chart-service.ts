import $api from '../api/index';
import { AxiosResponse } from 'axios';

export default class ChartService{
    static fetchCandles(code: string, tf: number, index: number): any{
        return $api.post('/getCandles', {code, tf, index});
    }
}