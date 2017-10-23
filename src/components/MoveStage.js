import React from 'react'

import Stage from './Stage'
import PolygonControl from './PolygonControl'
import withMoveStage from './withMoveStage'


class MoveStage extends React.Component
{
    state = {
        editedPolygon: null
    }

    selectPolygon( index )
    {
        this.setState( { editedPolygon: index } )
    }

    render()
    {
        const { polygon, editedPolygon } = this.state
        const { polygons } = this.props

        return (
            <Stage
                highlighted={ editedPolygon }
                polygons={ polygons }>

                <PolygonControl
                    points={ polygon }
                    onChange={ () => {}  } />

            </Stage>
        )
    }
}



export default withMoveStage( MoveStage )
