export const capitalizedKebabCase = ( str: any ) => String( str ).replace( /([a-z])([A-Z])/g, '$1-$2' ).replace( /[\s_.]+/g, '-' );

export const kebabCase = ( str: any ) => capitalizedKebabCase( String( str ) ).toLowerCase();

export const capitalizedSpaceCase = (str: any) => {
    return String(str)
        .replace(/([^.])([A-Z])/g, '$1 $2')
        .replace(/([_.\-]+|\d+)([a-zA-Z])/g, ' $2')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const spaceCase = ( str: any ) => capitalizedSpaceCase( String( str ) ).toLowerCase();

export function escapeRegExp( string: string ) {
    return string.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
}
