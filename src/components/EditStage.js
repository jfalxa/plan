import React from 'react'
import isNull from 'lodash/isNull';

import withEditStage from './withEditStage';
import Stage from './Stage'
import Polygon from './Polygon';
import { snapToGrid } from '../utils/grid';
import { isFirstPoint, endPolygonWith, findPolygon } from '../utils/geometry';


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

    editPolygon( index, point )
    {
        // recreate an array of point based on the edited polygon, ordered in a
        // way that the last one is the one closer to the point being added here
        const polygon = endPolygonWith( point, this.props.polygons[index] )
        this.setState( { editedPolygon: index, points: polygon } )
    }

    addPolygon( polygon )
    {
        this.props.addPolygon( polygon )
        this.resetStage()
    }

    replacePolygon( index, polygon )
    {
        this.props.replacePolygon( index, polygon )
        this.resetStage()
    }

    handleMove = ( e ) => {
        this.setState( { position: snapToGrid( [e.clientX, e.clientY] ) } )
    }

    handleClick = ( e ) => {
        const { polygons } = this.props
        const { editedPolygon, position, points } = this.state

        // if the click is on the starting point, close the polygon
        if ( isFirstPoint( position, points ) )
        {
            return isNull( editedPolygon )
                ? this.addPolygon( points )
                : this.replacePolygon( editedPolygon, points )
        }
        // or simply add a new point to the current polygon
        else if ( points.length > 0 )
        {
            return this.addPoint( position )
        }

        // check if we try to edit an existing polygon
        const index = findPolygon( position, polygons )

        // if so, start editing this polygon
        // otherwise, add a new point
        return ( index >= 0 )
            ? this.editPolygon( index, position )
            : this.addPoint( position )

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
                    selected={ canClose }
                    points={ [...points, position] } />

            </Stage>
        )
    }
}


export default withEditStage( EditStage )

