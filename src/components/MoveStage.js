import React from 'react'
import isNull from 'lodash/isNull'

import Stage from './Stage'
import PolygonControl from './PolygonControl'
import withMoveStage from './withMoveStage'


class MoveStage extends React.Component
{
    componentDidMount()
    {
        document.addEventListener( 'keypress', this.removePolygon )
    }

    componentWillUnmount()
    {
        document.removeEventListener( 'keypress', this.removePolygon )
    }

    updatePolygon = ( polygon, create ) => {
        const { editedPolygon, addPolygon, replacePolygon } = this.props

        return create
            ? addPolygon( polygon )
            : replacePolygon( editedPolygon, polygon )
    }

    removePolygon = ( e ) => {
        if ( e.key === 'Delete' )
        {
            this.props.replacePolygon( this.props.editedPolygon, null )
        }
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
