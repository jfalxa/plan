import React from 'react'
import isNull from 'lodash/isNull';

import withEditStage from './withEditStage';
import Stage from './Stage'
import Polygon from './Polygon';
import { snapToGrid } from '../utils/grid';
import { isFirstPoint, isOnEdge, findPolygon } from '../utils/geometry';


class EditStage extends React.Component
{
    state = {
        position: [0, 0],
        points: [],
        editedPolygon: null
    }

    resetStage()
    {
        this.setState( { points: [], editedPolygon: null } )
    }

    addPoint( point )
    {
        this.setState( { points: [...this.state.points, point] } )
    }

    editPolygon( index )
    {
        this.setState( { editedPolygon: index } )
    }

    addPolygon( polygon )
    {
        this.props.addPolygon( polygon )
        this.resetStage()
    }

    extendPolygon( index, points )
    {
        this.props.extendPolygon( index, points )
        this.resetStage()
    }

    handleMove = ( e ) => {
        this.setState( { position: snapToGrid( [e.clientX, e.clientY] ) } )
    }

    handleClick = ( e ) => {
        const { polygons } = this.props
        const { editedPolygon, position, points } = this.state

        // if a polygon is being edited and the click is made again on the polygon edge
        if ( !isNull( editedPolygon ) && isOnEdge( position, polygons[editedPolygon] ) )
        {
            return this.extendPolygon( editedPolygon, [...points, position] )
        }
        // if the click is on the starting point, close the polygon
        else if ( isFirstPoint( position, points ) )
        {
            return this.addPolygon( points )
        }
        // or simply add a new point to the current polygon
        else if ( points.length > 0 )
        {
            return this.addPoint( position )
        }

        // check if we try to edit an existing polygon
        const index = findPolygon( position, polygons )

        // if so, start editing this polygon
        if ( index >= 0 )
        {
            this.editPolygon( index )
        }

        this.addPoint( position )
    }

    render()
    {
        const { points, position } = this.state
        const { polygons } = this.props
        const canClose = isFirstPoint( position, points )

        return (
            <Stage
                polygons={ polygons }
                onClick={ this.handleClick }
                onMouseMove={ this.handleMove }>

                <Polygon
                    edited={ !canClose }
                    highlighted={ canClose }
                    points={ [...points, position] } />

            </Stage>
        )
    }
}


export default withEditStage( EditStage )

