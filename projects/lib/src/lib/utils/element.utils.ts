export function elementWidthWithoutPadding( element: HTMLElement ): number {

    const cs = getComputedStyle( element );

    const paddingX = parseFloat( cs.paddingLeft ) + parseFloat( cs.paddingRight );

    return element.offsetWidth - paddingX;
}

export function remToPixels( rem: number ) {
    return rem * parseFloat( getComputedStyle( document.documentElement ).fontSize );
}
