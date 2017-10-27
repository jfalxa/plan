import React from 'react'
import isNull from 'lodash/isNull'
import flatMap from 'lodash/flatMap'
import last from 'lodash/last'

import withEditStage from './withEditStage'
import Stage from './Stage'
import Polygon from './Polygon'
import DistanceDot from './DistanceDot'
import DistancePolygon from './DistancePolygon'
import HoverPoint from './HoverPoint'
import { snapToGrid } from '../utils/grid'
import { project, alignPoints, isFirstPoint, isOnPolygon, isEqual } from '../utils/geometry'


class EditStage extends React.Component
{
    state = {
        position: null,
        points: []
    }

    resetStage()
    {
        this.setState( { points: [] } )
    }

    addPoint( point )
    {
        this.setState( { points: [...this.state.points, point] } )
    }

    removePoint()
    {
        const { points } = this.state

        if ( points.length <= 1 )
        {
            this.resetStage()
            this.editPolygon( null )
        }
        else
        {
            this.setState( { points: [...points.slice( 0, points.length-1 )] } )
        }
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

    editPolygon( index, position )
    {
        this.props.editPolygon( index )
        position && this.addPoint( position )
    }

    removePolygonPoint( polygonIndex, pointIndex )
    {
        const polygon = this.props.polygons[polygonIndex]
        const modifiedPolygon = [...polygon.slice( 0, pointIndex ), ...polygon.slice( pointIndex + 1 )]

        this.props.replacePolygon( polygonIndex, modifiedPolygon )
    }

    findPolygon( point )
    {
        return this.props.polygons.findIndex( polygon => isOnPolygon( point, polygon ) )
    }

    handleMove = ( e ) => {
        const { pan, zoom } = this.props

        const lastPoint = last( this.state.points )
        const svgPosition = project( [e.clientX, e.clientY], pan, zoom )
        const gridPosition = snapToGrid( svgPosition )

        // only move vertically or horizontally while holding the shift key
        const position = ( e.shiftKey && lastPoint )
            ? alignPoints( lastPoint, gridPosition )
            : gridPosition

        this.setState( { position } )
    }

    handleRightClick = ( e ) => {
        e.preventDefault()
        this.removePoint()
    }

    handlePointRightClick = ( polygonIndex, pointIndex ) => ( e ) => {
        e.preventDefault()
        e.stopPropagation()

        // only remove polygon points when something is not being edited
        if ( this.state.points.length === 0 )
        {
            this.removePolygonPoint( polygonIndex, pointIndex )
        }
    }

    handleClick = ( e ) => {
        const { position, points } = this.state
        const { editedPolygon, polygons } = this.props

        const hasPoints = ( points.length > 0 )
        const isPolygonEdited = !isNull( editedPolygon )
        const isPolygonClicked = isPolygonEdited
            ? isOnPolygon( position, polygons[editedPolygon] )
            : false;

        // ignore clicking many times in a row at the same position
        if ( !position || ( hasPoints && isEqual( position, last( points ) ) ) )
        {
            return
        }
        else if ( isPolygonEdited )
        {
            // when a polygon is being edited and user clicks again on it
            if ( hasPoints && isPolygonClicked )
            {
                // add the new path to the existing polygon
                return this.extendPolygon( editedPolygon, [...points, position] )
            }
            // when a polygon is being edited but user starts creating a new one outside
            else if ( !isPolygonClicked && !hasPoints )
            {
                // reset selection and start a new polygon at this position
                return this.editPolygon( null, position )
            }
        }
        else
        {
            // when user clicks on the first point of a newly created polygon
            if ( isFirstPoint( position, points ) )
            {
                // close it and add it to the list
                return this.addPolygon( points )
            }
            else if ( e.ctrlKey )
            {
                // check if we try to edit an existing polygon
                const index = this.findPolygon( position )

                // if so, start editing this polygon
                // otherwise reset selection
                return this.editPolygon( index >= 0 ? index : null, position )
            }
        }

        this.addPoint( position )
    }

    render()
    {
        const { points, position } = this.state
        const { editedPolygon, polygons, pan, zoom, panZoom } = this.props

        const canClose = isFirstPoint( position, points )

        return (
            <Stage
                pan={ pan }
                zoom={ zoom }
                onPanZoom={ panZoom }
                onClick={ this.handleClick }
                onContextMenu={ this.handleRightClick }
                onMouseMove={ this.handleMove }>

                { polygons.map( ( polygon, i ) => (
                    <Polygon
                        key={ i }
                        index={ i }
                        edited={ i === editedPolygon }
                        points={ polygon } />
                ) ) }

                { !isNull( editedPolygon ) && <DistancePolygon points={ polygons[editedPolygon] } /> }

                <Polygon
                    opened
                    highlighted={ canClose }
                    points={ [...points, position] } />

                <DistanceDot
                    position={ position }
                    previous={ last( points ) } />

                { flatMap( polygons, ( polygon, polygonIndex ) => polygon.map( ( point, pointIndex ) => (
                    <HoverPoint
                        key={ polygonIndex + '_' + pointIndex }
                        color="red"
                        position={ point }
                        onContextMenu={ this.handlePointRightClick( polygonIndex, pointIndex ) } />
                ) ) ) }

            </Stage>
        )
    }
}


export default withEditStage( EditStage )

