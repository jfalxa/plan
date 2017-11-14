import React from 'react'
import isNull from 'lodash/isNull'
import { HotKeys } from 'react-hotkeys'

import Stage from './Stage'
import Polygon from './Polygon'
import PolygonControl from './PolygonControl'
import withMoveStage from './withMoveStage'


class MoveStage extends React.Component
{
    keymap = {
        'remove': ['del', 'backspace']
    }

    hotkeys = {
        'remove': () => this.removePolygon()
    }

    updatePolygon = ( polygon, create ) => {
        const { editedPolygon, addPolygon, replacePolygon } = this.props

        return create
            ? addPolygon( polygon )
            : replacePolygon( editedPolygon, polygon )
    }

    removePolygon()
    {
        this.props.replacePolygon( this.props.editedPolygon, null )
    }

    orderPolygon = ( direction ) => {
        this.props.orderPolygon( this.props.editedPolygon, direction )
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
            <HotKeys focused attach={ document } keyMap={ this.keymap } handlers={ this.hotkeys }>
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
                            pan={ pan }
                            zoom={ zoom }
                            points={ polygons[editedPolygon] }
                            onChange={ this.updatePolygon }
                            onOrder={ this.orderPolygon }/>
                    ) }

                </Stage>
            </HotKeys>
        )
    }
}


export default withMoveStage( MoveStage )
