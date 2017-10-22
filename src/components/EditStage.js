import React from 'react'
import isNull from 'lodash/isNull';

import withEditStage from './withEditStage';
import Stage from './Stage'
import Polygon from './Polygon';
import { snapToGrid } from '../utils/grid';
import { isFirstPoint, isOnPolygon, isEqual } from '../utils/geometry';


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

    removePoint()
    {
        const { points } = this.state

        if ( points.length === 1 )
        {
            this.resetStage()
        }
        else
        {
            this.setState( { points: [...points.slice( 0, points.length-1 )] } )
        }
    }

    editPolygon( index )
    {
        this.setState( { editedPolygon: index } )
    }

    addPolygon( polygon )
    {
        if ( polygon.length >= 2 )
        {
            this.props.addPolygon( polygon )
        }

        this.resetStage()
    }

    extendPolygon( index, points )
    {
        this.props.extendPolygon( index, points )
        this.resetStage()
    }

    findPolygon( point )
    {
        return this.props.polygons.findIndex( polygon => isOnPolygon( point, polygon ) )
    }

    handleMove = ( e ) => {
        this.setState( { position: snapToGrid( [e.clientX, e.clientY] ) } )
    }

    handleRightClick = ( e ) => {
        e.preventDefault()
        this.removePoint()
    }

    handleClick = ( e ) => {
        const { editedPolygon, position, points } = this.state

        // ignore clicking many times in a row at the same position
        if ( points.length > 0 && isEqual( position, points[points.length-1] ) )
        {
            return
        }
        // if a polygon is being edited and the click is made again on the polygon edge
        else if ( !isNull( editedPolygon ) && isOnPolygon( position, this.props.polygons[editedPolygon] ) )
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
        const index = this.findPolygon( position )

        // if so, start editing this polygon
        if ( index >= 0 )
        {
            this.editPolygon( index )
        }

        this.addPoint( position )
    }

    render()
    {
        const { points, position, editedPolygon } = this.state
        const { polygons } = this.props
        const canClose = isFirstPoint( position, points )

        return (
            <Stage
                highlighted={ editedPolygon }
                polygons={ polygons }
                onClick={ this.handleClick }
                onMouseMove={ this.handleMove }
                onContextMenu={ this.handleRightClick }>

                <Polygon
                    edited={ !canClose }
                    highlighted={ canClose }
                    points={ [...points, position] } />

                <circle r={ 5 } cx={ position[0] } cy={ position[1] } />

            </Stage>
        )
    }
}


export default withEditStage( EditStage )

