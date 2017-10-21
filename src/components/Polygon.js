import React from 'react';
import { css, cx } from 'react-emotion';
import { toPath } from '../utils/svg';


const polygon = css`
    stroke: gray;
    stroke-width: 3;
    fill: #f5f5f5;
`

const editedClass = css`
    stroke: red
`

const selectedClass = css`
    stroke: green
`


function Polygon( { points, edited, selected } )
{
    const classNames = cx(
        polygon,
        { [editedClass]: edited },
        { [selectedClass]: selected }
    )

    return (
        <path
            d={ toPath( points ) }
            className={ classNames } />
    )
}


export default Polygon
