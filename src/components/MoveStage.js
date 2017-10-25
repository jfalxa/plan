import React from 'react'
import isNull from 'lodash/isNull'

import Stage from './Stage'
import Polygon from './Polygon'
import PolygonControl from './PolygonControl'
import withMoveStage from './withMoveStage'


class MoveStage extends React.Component
{
    componentDidMount()
    {
        document.addEventListener( 'keydown', this.removePolygon )
    }

    componentWillUnmount()
    {
        document.removeEventListener( 'keydown', this.removePolygon )
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

    handleSelectPolygon = ( i ) => ( e ) => {
        e.stopPropagation()
        this.props.editPolygon( i )
    }

    render()
    {
        const { pan, zoom, polygons, editedPolygon, panZoom } = this.props

        return (
            <Stage
                pan={ pan }
                zoom={ zoom }
                onPanZoom={ panZoom }
                onContextMenu={ this.handleRightClick }>

                { polygons.map( ( polygon, i ) => (
                    <Polygon
                        key={ i }
                        index={ i }
                        edited={ i === editedPolygon }
                        points={ polygon }
                        onMouseDown={ this.handleSelectPolygon( i ) } />
                ) ) }

                { !isNull( editedPolygon ) && (
                    <PolygonControl
                        zoom={ zoom }
                        points={ polygons[editedPolygon] }
                        onChange={ this.updatePolygon } />
                ) }

            </Stage>
        )
    }
}


export default withMoveStage( MoveStage )
