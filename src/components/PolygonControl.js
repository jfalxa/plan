import React from 'react'

import Polygon from './Polygon'


class PolygonControl extends React.Component
{
    state = {
        points: []
    }

    render()
    {
        const { points } = this.state

        return (
            <g>
                <Polygon points={ points } />
            </g>
        )
    }
}


export default PolygonControl
