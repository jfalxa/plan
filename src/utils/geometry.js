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


function findPath( first, last, polygon )
{
    const path = []

    let i = 0
    let isFirstFound = false
    let isLastFound = false

    while( !isLastFound )
    {
        const currentEdge = edge( i, polygon )
        const isFirstInEdge = isInSegment( first, currentEdge )
        const isLastInEdge = isInSegment( last, currentEdge )

        i = ( i + 1 ) % polygon.length

        if ( isFirstFound && !isLastInEdge )
        {
            path.push( polygon[i] )
        }

        if ( isFirstFound && isLastInEdge )
        {
            isLastFound = true
        }

        if ( !isFirstFound && isFirstInEdge )
        {
            isFirstFound = true
            path.push( polygon[i] )
        }
    }

    return path
}


export function combinePolygons( a, b )
{
    const first = b[0]
    const last = b[b.length-1]

    const reverseA = [...a].reverse()
    const reverseB = [...b].reverse()

    const firstEdge = findEdge( first, a )
    const lastEdge = findEdge( last, a )

    // find the two paths that connect first to last on a
    const path = findPath( first, last, a )
    const reversePath = findPath( first, last, reverseA )

    const pathArea = Math.abs( polygonArea( [...path, ...reverseB] ) )
    const reversePathArea = Math.abs( polygonArea( [...reversePath, ...reverseB] ) )

    // only keep the one that generates the bigger polygon
    const longerPath = ( pathArea > reversePathArea ) ? path : reversePath

    // when both points are on the same edge, check which one is closer to the first point
    return ( firstEdge === lastEdge ) && ( distance( first, longerPath[0] ) > distance( last, longerPath[0] ) )
        ? [...longerPath, ...b]
        : [...longerPath, ...reverseB]
}

