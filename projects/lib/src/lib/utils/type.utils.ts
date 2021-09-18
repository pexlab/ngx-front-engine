export type Constructor<T = object> = new ( ...args: any[] ) => T;

export interface ClassWithProperties<T> {
    new( ...args: any[] ): T;
}

export type Replace<T, From, To> = T extends ( ...args: any[] ) => any ? T : {
    [K in keyof T]:
    [ T[K], From ] extends [ From, T[K] ] ? To : Replace<T[K], From, To>
}

export type Exclude<T, U> = T extends U ? never : T;

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * Source: {@link https://stackoverflow.com/a/48218209}
 */
export function mergeObj( ...objects: any[] ): any {
    
    const isObject = ( obj: any ) => obj && typeof obj === 'object';
    
    return objects.reduce( ( prev, obj ) => {
        
        if ( !obj ) {
            return prev;
        }
        
        Object.keys( obj ).forEach( key => {
            
            const pVal = prev[ key ];
            const oVal = obj[ key ];
            
            if ( Array.isArray( pVal ) && Array.isArray( oVal ) ) {
                prev[ key ] = pVal.concat( ...oVal );
            } else if ( isObject( pVal ) && isObject( oVal ) ) {
                prev[ key ] = mergeObj( pVal, oVal );
            } else {
                prev[ key ] = oVal;
            }
        } );
        
        return prev;
        
    }, {} );
}