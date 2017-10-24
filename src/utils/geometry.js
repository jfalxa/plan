import { polygonArea } from 'd3-polygon'


export function isEqual( a, b )
{
    return ( a[0] === b[0] ) && ( a[1] === b[1] )
}

export function move( a, b )
{
    return [a[0] + b[0], a[1] + b[1]]
}

export function subtract( origin, destination )
{
    return [destination[0] - origin[0], destination[1] - origin[1]]
}

export function distance( origin, destination )
{
    const delta = subtract( origin, destination )

    return Math.sqrt( delta[0]*delta[0] + delta[1]*delta[1] )
}


export function isFirstPoint( point, polygon )
{
    return ( polygon.length > 0 ) && isEqual( point, polygon[0] )
}


export function isInSegment( point, segment )
{
    const am = distance( segment[0], point )
    const mb = distance( point, segment[1] )
    const ab = distance( segment[0], segment[1] )

    return ( am + mb ) - ab < 3
}


export function findEdge( point, polygon )
{
    return polygon.findIndex( ( _, i ) => isInSegment( point, edge( i, polygon ) ) )
}


export function isOnPolygon( point, polygon )
{
    return findEdge( point, polygon ) >= 0
}


function edge( index, polygon )
{
    return [polygon[index], polygon[(index+1) % polygon.length]]
}


function findPath( point, polygon )
{
    const index = findEdge( point, polygon )
    return polygon.slice( 0, index + 1 )
}


// meeeeeh this algorithm is still missing something
// BUG: when drawing a triangle starting from the first polygon point to the second
export function combinePolygons( a, b )
{
    const first = b[0]
    const last = b[b.length-1]

    const firstEdge = findEdge( first, a )
    const lastEdge = findEdge( last, a )

    const hasSameEdge = ( firstEdge === lastEdge )
    const isFirstFirst = isEqual( first, a[0] )
    const isLastSecond = isEqual( last, a[1] )

    // reorganize a's points so they begin with the point closer to first
    const points = !( isFirstFirst && isLastSecond )
        ? [...a.slice( firstEdge + 1 ), ...a.slice( 0, firstEdge + 1 )]
        : [...a.reverse()]

    // find the two paths that connect first to last on a
    const path = findPath( last, points )
    const reversePath = !hasSameEdge
        ? findPath( last, points.reverse() )
        : []

    const pathArea = polygonArea( [...path, ...b.reverse()] )
    const reversePathArea = polygonArea( [...reversePath, ...b.reverse()] )

    // only keep the one that generates the bigger polygon
    const longerPath = Math.abs( pathArea ) > Math.abs( reversePathArea )
        ? path
        : reversePath

    // when both points are on the same edge, check which one is closer to the first point
    return ( hasSameEdge && ( longerPath.length === 0 || distance( first, longerPath[0] ) > distance( last, longerPath[0] ) ) )
        ? [...longerPath, ...b]
        : [...longerPath, ...b.reverse()]
}

