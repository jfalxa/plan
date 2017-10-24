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
            this.props.editPolygon( null )
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
        const { editedPolygon, polygons, editPolygon } = this.props

        // ignore clicking many times in a row at the same position
        if ( !position || ( points.length > 0 && isEqual( position, last( points ) ) ) )
        {
            return
        }
        // if a polygon is being edited and the click is made again on the polygon edge
        else if ( !isNull( editedPolygon ) && isOnPolygon( position, polygons[editedPolygon] ) && points.length > 0 )
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
        // otherwise reset selection
        editPolygon( index >= 0 ? index : null )

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

