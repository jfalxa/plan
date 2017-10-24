import React from 'react'

import { Point } from './HoverPoint'
import { meterDistance } from '../utils/grid'


const MARGIN = 10


function DistanceDot( { position, previous } )
{
    if ( !position )
    {
        return null
    }

    return (

        <g>
            <Point position={ position } />

            { previous && (
                <text x={ position[0] + MARGIN } y={ position[1] - MARGIN }>
                    { meterDistance( previous, position ) }m
                </text>
            ) }
        </g>

    );
}


export default DistanceDot
