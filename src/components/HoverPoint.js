import React from 'react';
import styled from 'react-emotion'


export function Point( { position, color, ...circleProps } )
{
    return (
        <circle
            { ...circleProps }
            r="4"
            fill={ color }
            cx={ position[0] }
            cy={ position[1] } />
    )
}


export const InvisiblePoint = styled( Point )`
    r: 15;
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
                color={ color }
                position={ position } />

            <InvisiblePoint
                { ...pointProps }
                color={ color }
                position={ position } />
        </g>
    )
}


export default HoverPoint;
