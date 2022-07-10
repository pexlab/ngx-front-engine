function circularPath( x: number, y: number, radius: number, clockwise: boolean) {
    return `M ${ x - radius },${ y } ` +
        `a ${ radius },${ radius } 0 1,${clockwise ? 1 : 0} ${ radius * 2 },0 ` +
        `a ${ radius },${ radius } 0 1,${clockwise ? 1 : 0} -${ radius * 2 },0`;
}

export const SVGUtil = {
    circularPath
};
