import React from 'react'

import withEditStage from './withEditStage';
import Stage from './Stage'
import Polygon from './Polygon';
import { snapToGrid } from '../utils/grid';
import { isFirstPoint } from '../utils/geometry';


class EditStage extends React.Component
{
    state = {
        position: [0, 0],
        points: []
    }

    addPolygon( polygon )
    {
        this.props.addPolygon( polygon )
        this.setState( { points: [] } )
    }

    updatePosition = ( e ) => {
        this.setState( { position: snapToGrid( [e.clientX, e.clientY] ) } )
    }

    addPoint = ( e ) => {
        const { position, points } = this.state

        // if the click is on the starting point, close the polygon
        if ( isFirstPoint( position, points ) )
        {
            return this.addPolygon( points )
        }

        // or simply add a new point to the current polygon
        this.setState( { points: [...points, position] } )
    }

    render()
    {
        const { points, position } = this.state
        const { polygons } = this.props
        const canClose = isFirstPoint( position, points )

        return (
            <Stage
                polygons={ polygons }
                onClick={ this.addPoint }
                onMouseMove={ this.updatePosition }>

                <Polygon
                    edited={ !canClose }
                    selected={ canClose }
                    points={ [...points, position] } />

            </Stage>
        )
    }
}


export default withEditStage( EditStage )

