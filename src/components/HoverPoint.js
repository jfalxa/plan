import React from 'react';
import styled from 'react-emotion'


export function Point( { position, r=4, color='black', ...circleProps } )
{
    return (
        <circle
            { ...circleProps }
            r={ r }
            fill={ color }
            cx={ position[0] }
            cy={ position[1] } />
    )
}


export const InvisiblePoint = styled( Point )`
    fill: transparent;

    &:hover
    {
        fill: ${ p => p.color || 'black' };
        opacity: 0.3;
    }
`

function HoverPoint( { position, color, ...pointProps } )
{
    return (
        <g>
            <Point
                r="4"
                color={ color }
                position={ position } />

            <InvisiblePoint
                { ...pointProps }
                r="15"
                color={ color }
                position={ position } />
        </g>
    )
}


export default HoverPoint;
