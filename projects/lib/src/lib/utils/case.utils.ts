export const capitalizedKebabCase = ( str: any ) => String( str ).replace( /([a-z])([A-Z])/g, '$1-$2' )       // get all lowercase letters that are near to uppercase ones
                                                                  .replace( /[\s_.]+/g, '-' );                 // replace all spaces, underscores and dots with a dash

export const kebabCase = ( str: any ) => capitalizedKebabCase( String( str ) ).toLowerCase();
