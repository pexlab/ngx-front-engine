export function elementWidthWithoutPadding( element: HTMLElement ): number {

    const cs = getComputedStyle( element );

    const paddingX = parseFloat( cs.paddingLeft ) + parseFloat( cs.paddingRight );

    return element.offsetWidth - paddingX;
}

export function remToPixels( rem: number ) {
    return rem * parseFloat( getComputedStyle( document.documentElement ).fontSize );
}

function findAncestorScrollContainers( element: HTMLElement ): HTMLElement[] {
    const scrollContainers: HTMLElement[] = [];
    let parentNode                        = element.parentNode;

    while ( parentNode && parentNode instanceof HTMLElement ) {
        const overflowY = getComputedStyle( parentNode ).overflowY;
        if ( overflowY === 'auto' || overflowY === 'scroll' ) {
            scrollContainers.push( parentNode );
        }
        parentNode = parentNode.parentNode;
    }

    return scrollContainers;
}

export function isElementVisible(
    element: HTMLElement,
    container: HTMLElement,
    offsetTop: number    = 0,
    offsetBottom: number = 0
): boolean {
    const elementRect = element.getBoundingClientRect();

    const ancestorScrollContainers = findAncestorScrollContainers( container );

    return ancestorScrollContainers.every( ( scrollContainer ) => {

        const scrollContainerRect = scrollContainer.getBoundingClientRect();

        return (
            ( elementRect.top - offsetTop ) <= scrollContainerRect.bottom &&
            ( elementRect.bottom + offsetBottom ) >= scrollContainerRect.top &&
            elementRect.left <= scrollContainerRect.right &&
            elementRect.right >= scrollContainerRect.left
        );
    } );
}

export function isElementVisibleInScrollableContainer(
    element: HTMLElement,
    container: HTMLElement,
    offsetTop: number    = 0,
    offsetBottom: number = 0
): {
    visible: boolean,
    bottomAboveContainerTop: number,
    topBelowContainerBottom: number,
    height: number
} {

    const elementRect         = element.getBoundingClientRect();
    const scrollContainerRect = container.getBoundingClientRect();

    const pxElBottomAboveContainerTop = scrollContainerRect.top - ( elementRect.bottom + offsetBottom );
    const pxElTopBelowContainerBottom = ( elementRect.top + offsetTop ) - scrollContainerRect.bottom;

    return {
        visible                : (
            pxElBottomAboveContainerTop <= 0 &&
            pxElTopBelowContainerBottom <= 0
        ),
        bottomAboveContainerTop: pxElBottomAboveContainerTop,
        topBelowContainerBottom: pxElTopBelowContainerBottom,
        height                 : element.offsetHeight
    };
}
