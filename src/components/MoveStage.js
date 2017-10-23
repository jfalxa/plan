import React from 'react'
import isNull from 'lodash/isNull'

import Stage from './Stage'
import PolygonControl from './PolygonControl'
import withMoveStage from './withMoveStage'


class MoveStage extends React.Component
{
    state = {
        editedPolygon: null
    }

    resetStage = ( e ) => {
        this.setState( { editedPolygon: null } )
    }

    selectPolygon = ( index ) => {
        this.setState( { editedPolygon: index } )
    }

    updatePolygon = ( polygon ) => {
        this.props.replacePolygon( this.state.editedPolygon, polygon )
    }

    render()
    {
        const { editedPolygon } = this.state
        const { polygons } = this.props

        return (
            <Stage
                edited={ editedPolygon }
                polygons={ polygons }
                onSelect={ this.selectPolygon }>

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
