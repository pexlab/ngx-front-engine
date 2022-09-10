export function rawFes( value: number ) {
    return '(var(--fe-local-preference-scale, var(--fe-global-preference-scale, 1rem)) * ' + ( Math.round( 16 * value ) / 16 ) + ')';
}

export function fes( value: number ) {
    return 'calc(' + rawFes( value ) + ')';
}

export function rawVw( value: number ) {
    return '(' + value + ' * (var(--fe-local-analyzed-inner-width, var(--fe-global-analyzed-inner-width, 100vw)) / 100))';
}

export function vw( value: number ) {
    return 'calc(' + rawVw( value ) + ')';
}

export function rawVh( value: number ) {
    return '(' + value + ' * (var(--fe-local-analyzed-inner-height, var(--fe-global-analyzed-inner-height, 100vh)) / 100))';
}

export function vh( value: number ) {
    return 'calc(' + rawVh( value ) + ')';
}
