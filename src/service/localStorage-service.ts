

export default class LacalStorageService{
    static getCountCandles(): number{
        return Number(localStorage.getItem('countCandles')) || 100;
    }

    static getFirstCandle(): number{
        return Number(localStorage.getItem('firstCandle'));
    }

    static getLeftTimeframe(): number{
        return Number(localStorage.getItem('leftTimeframe')) || 60;
    }

    static getRightTimeframe(): number{
        return Number(localStorage.getItem('rightTimeframe')) || 5;
    }

    static getCode(code: string): string{
        return localStorage.getItem('code') || code;
    }

}