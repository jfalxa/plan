import React from 'react'
import isNull from 'lodash/isNull'

import Stage from './Stage'
import PolygonControl from './PolygonControl'
import withMoveStage from './withMoveStage'


class MoveStage extends React.Component
{
    updatePolygon = ( polygon, create ) => {
        const { editedPolygon, addPolygon, replacePolygon } = this.props

        return create
            ? addPolygon( polygon )
            : replacePolygon( editedPolygon, polygon )
    }

    handleRightClick = ( e ) => {
        e.preventDefault()
        this.props.editPolygon( null )
    }

    render()
    {
        const { polygons, editedPolygon, editPolygon } = this.props

        return (
            <Stage
                edited={ editedPolygon }
                polygons={ polygons }
                onSelect={ editPolygon }
                onContextMenu={ this.handleRightClick }>

                { !isNull( editedPolygon ) && (
                    <PolygonControl
                        points={ polygons[editedPolygon] }
                        onChange={ this.updatePolygon } />
                ) }

            </Stage>
        )
    }
}


export default withMoveStage( MoveStage )
