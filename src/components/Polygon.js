import React from 'react'
import { css, cx } from 'react-emotion'
import { toPath } from '../utils/svg'


const polygon = css`
    stroke: gray;
    stroke-width: 3;
    fill: #f5f5f5;
`

const editedClass = css`
    stroke: orange;
`

const openedClass = css`
    stroke: red;
    fill: transparent;
`

const highlightedClass = css`
    stroke: green;
    fill: rgba(0, 255, 0, 0.3);
`


function Polygon( { points, opened, edited, highlighted, ...pathProps } )
{
    const classNames = cx(
        polygon,
        { [openedClass]: opened },
        { [editedClass]: edited },
        { [highlightedClass]: highlighted }
    )

    return (
        <path
            { ...pathProps }
            d={ toPath( points, opened ) }
            className={ classNames } />
    )
}


export default Polygon
