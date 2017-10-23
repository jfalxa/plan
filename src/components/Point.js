import React from 'react';


function Point( { position, ...circleProps } )
{
    return (
        <circle
            { ...circleProps }
            r="7"
            cx={ position[0] }
            cy={ position[1] } />
    )
}


export default Point;
