import {
    create,
    fromValues,
    subtract,
    distance,
    exactEquals
} from 'gl-matrix/src/gl-matrix/vec2'


export const point = fromValues


export function isFirstPoint( point, polygon )
{
    return ( polygon.length > 0 ) && exactEquals( point, polygon[0] )
}


export function isInSegment( point, segment )
{
    const am = distance( segment[0], point )
    const mb = distance( point, segment[1] )
    const ab = distance( segment[0], segment[1] )

    return ( am + mb ) === ab
}


export function findEdge( point, polygon )
{
    return polygon.findIndex( ( a, i ) => {
        const b = polygon[( i + 1 ) % polygon.length]
        return isInSegment( point, [a, b] )
    } )
}


export function isOnEdge( point, polygon )
{
    return findEdge( point, polygon ) >= 0
}


export function findPolygon( point, polygons )
{
    return polygons.findIndex( polygon => isOnEdge( point, polygon ) )
}


// check where b starts and ends on a and use it to learn wether b has to be
// applied using the same order (clockwise or not)
export function hasSameOrder( a, b )
{
    const first = b[0]
    const last = b[b.length - 1]

    const firstEdge = findEdge( first, a )
    const lastEdge = findEdge( last, a )

    return ( firstEdge === lastEdge )
        // if b's bounds are on the same edge of a, check which one is closer
        // to the first bound of this edge
        ? distance( a[firstEdge], first ) < distance( a[lastEdge], last )
        // otherwise simply check if the first is on an earlier edge of a than the last
        : firstEdge < lastEdge
}


export function cutPolygon( a, b )
{
    const beforeIndex = findEdge( b[0], a )
    const afterIndex = findEdge( b[b.length-1], a ) + 1

    const before = a.slice( 0, beforeIndex + 1 )
    const after = a.slice( afterIndex )

    return [before, after]
}


export function combinePolygons( a, b )
{
    if ( !hasSameOrder( a, b ) )
    {
        b.reverse()
    }

    const [before, after] = cutPolygon( a, b )

    return [...before, ...b, ...after]
}


export function vector( origin, destination )
{
    return subtract( create(), destination, origin )
}

