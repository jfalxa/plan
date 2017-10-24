import { distance } from './geometry'


export const METER_TO_PX = 100 // 100px for 1m
export const PX_TO_METER = 1 / METER_TO_PX
export const GRID_CELL   = 0.1 * METER_TO_PX // a grid cell represents 0.1m


export function snapToGrid( [x, y] )
{
    const gridX = Math.round( x / GRID_CELL ) * GRID_CELL
    const gridY = Math.round( y / GRID_CELL ) * GRID_CELL

    return [gridX, gridY]
}


export function meterDistance( origin, destination )
{
    return ( distance( origin, destination ) * PX_TO_METER ).toFixed( 1 )
}
