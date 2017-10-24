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


export function scale( vector, factor )
{
    return [vector[0] * factor, vector[1] * factor]
}


export function distance( origin, destination )
{
    const delta = subtract( origin, destination )

    return Math.sqrt( delta[0]*delta[0] + delta[1]*delta[1] )
}


export function project( position, pan, zoom )
{
    return [
        position[0] / zoom + pan[0],
        position[1] / zoom + pan[1]
    ]
}


export function edge( index, polygon )
{
    return [polygon[index], polygon[(index+1) % polygon.length]]
}


export function clockwise( polygon )
{
    return isClockwise( polygon ) ? polygon : [...polygon].reverse()
}


// returns a vector based on b and aligned with a
export function alignPoints( a, b )
{
    const delta = subtract( a, b )

    // if the distance if bigger on the horizontal axis
    return ( Math.abs( delta[0] ) > Math.abs( delta[1] ) )
        // align horizontally
        ? [b[0], a[1]]
        // align vertically
        : [a[0], b[1]]
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


export function isClockwise( polygon )
{
    const sum = polygon.reduce( ( sum, _, i ) => {
        const [a, b] = edge( i, polygon )
        return sum + ( b[0] - a[0] ) * ( b[1] + a[1] )
    }, 0 )

    return sum < 0
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

    // find the two paths that connect first to last on a
    const path = findPath( first, last, a )
    const reversePath = findPath( first, last, reverseA )


    const pathArea = Math.abs( polygonArea( [...path, ...reverseB] ) )
    const reversePathArea = Math.abs( polygonArea( [...reversePath, ...reverseB] ) )

    // only keep the one that generates the bigger polygon
    const longerPath = ( pathArea > reversePathArea ) ? path : reversePath

    const onSameEdge = ( path.length === a.length )
    const isFirstFirst = distance( first, longerPath[0] ) < distance( last, longerPath[0] )

    // when both points are on the same edge, check which one is closer to the first point
    return onSameEdge && !isFirstFirst
        ? [...longerPath, ...b]
        : [...longerPath, ...reverseB]
}

