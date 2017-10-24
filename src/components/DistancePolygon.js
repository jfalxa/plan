import React from 'react'

import { edge } from '../utils/geometry'
import { toPath } from '../utils/svg'
import { meterDistance } from '../utils/grid'


function DistancePolygon( { points } )
{
    return (
        <g>
            { points.map( (_, i) => edge( i, points ) ).map( ( segment, i ) => (
                <g key={ i }>
                    <path
                        id={ i }
                        d={ toPath( edge( i, points ), true ) } />

                    <text dy="-10" textAnchor="middle">
                        <textPath
                            xlinkHref={ '#' + i }
                            startOffset="50%">
                            { meterDistance( ...segment ) }m
                        </textPath>
                    </text>
                </g>
            ) ) }
        </g>
    )
}


export default DistancePolygon
