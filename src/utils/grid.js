export const METER_TO_PX = 200 // 200 px for 1m
export const PX_TO_METER = 1 / METER_TO_PX
export const GRID_CELL   = 0.1 * METER_TO_PX // a grid cell represents 0.1m


export function snapToGrid( [x, y] )
{
    const gridX = Math.round( x / GRID_CELL ) * GRID_CELL
    const gridY = Math.round( y / GRID_CELL ) * GRID_CELL

    return [gridX, gridY]
}

