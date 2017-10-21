import {
    create,
    fromValues,
    subtract,
    scaleAndAdd,
    dot,
    distance,
    squaredDistance,
    exactEquals
} from 'gl-matrix/src/gl-matrix/vec2'


export const point = fromValues


export function isFirstPoint( point, polygon )
{
    return ( polygon.length > 0 ) && exactEquals( point, polygon[0] )
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


export function endPolygonWith( point, polygon )
{
    const edgeIndex = findEdge( point, polygon )
    const before = polygon.slice( 0, edgeIndex + 1 )
    const after = polygon.slice( edgeIndex + 1 )

    return [...after, ...before, point]
}


export function vector( origin, destination )
{
    return subtract( create(), destination, origin )
}


export function isNearby( point, target, radius=10 )
{
    return distance( point, target ) <= radius
}


export function isInSegment( point, segment )
{
    const THRESHOLD = 5

    const am = distance( segment[0], point )
    const mb = distance( point, segment[1] )
    const ab = distance( segment[0], segment[1] )

    const difference = ( am + mb ) - ab

    return difference <= THRESHOLD
}


// point is m, segment is ab
export function distanceToSegment( m, [a, b] )
{
    // i.e. |b-a|^2
    const dist2 = squaredDistance( a, b )

    // when a = b
    if ( dist2 === 0 )
    {
        return distance( m, a )
    }

    const am = vector( a, m )
    const ab = vector( a, b )

    // Consider the line extending the segment, parameterized as a + t (b - a).
    // We find projection of point p onto the line.
    // It falls where t = [(m-a) . (b-a)] / |b-a|^2
    // We clamp t from [0,1] to handle points outside the segment ab.
    const baseT = dot( am, ab ) / dist2
    const t = Math.max( 0, Math.min( 1, baseT ) )

    // a + t * (b - a)
    const projection = scaleAndAdd( create(), a, ab, t )

    return distance( m, projection );
}


export function isNearbySegment( point, segment, radius=10 )
{
    return distanceToSegment( point, segment ) <= radius
}

