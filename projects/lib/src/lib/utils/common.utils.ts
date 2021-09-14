function englishSuffix( inputNumber: number ): string {
    
    if ( inputNumber > 10 && inputNumber <= 20 ) {
        return 'th';
    }
    
    const lastDigit = +( inputNumber.toString().split( '' ).pop() || 0 );
    
    switch ( lastDigit ) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function germanSuffix( inputNumber: number ): string {
    return '.';
}

export const Numerals = {
    englishSuffix,
    germanSuffix
};