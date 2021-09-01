export const capitalizedKebabCase = ( str: string ) => str
    .replace( /([a-z])([A-Z])/g, '$1-$2' )       // get all lowercase letters that are near to uppercase ones
    .replace( /[\s_]+/g, '-' );                  // replace all spaces and low dash

export const kebabCase = ( str: string ) => capitalizedKebabCase( str ).toLowerCase();