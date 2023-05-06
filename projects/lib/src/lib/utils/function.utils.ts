export function debounce( execute: () => void, wait: number ): () => void {
    
    let timeout: ReturnType<typeof setTimeout> | null;
    
    return function() {
        const later = () => {
            timeout = null;
            execute();
        };
        
        if ( timeout ) {
            clearTimeout( timeout );
        }
        
        timeout = setTimeout( later, wait );
    };
}
