export class MathUtils {
    
    /**
     * Method to round a number with a selected decimal precission. By default, round with two decimals
     * @param {number} number Number to round
     * @param {number} [decimalNumbers] Decimal numbers precission
     * 
     * @returns {number} Returns a rounded number with the specified decimals
     */
     static round(number: number, decimalNumbers?: number): number {
        if (!decimalNumbers) {
            decimalNumbers = 2;
        }
        return Number(Math.round(Number(number + 'e' + decimalNumbers)) + 'e-' + decimalNumbers);
    }
}
