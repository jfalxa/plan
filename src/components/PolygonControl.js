import React from 'react'

import Polygon from './Polygon'
import HoverPoint from './HoverPoint'
import DistancePolygon from './DistancePolygon'
import withMovement from './withMovement'
import { move, scale } from '../utils/geometry'
import { snapToGrid } from '../utils/grid'


const PointControl = withMovement( ( { position, movement, onMove, onMoveEnd } ) => (
    <HoverPoint
        color="green"
        position={ position }
        onMouseDown={ movement( onMove, onMoveEnd ) } />
) )


const PositionControl = withMovement( ( { points, movement, onMove, onMoveEnd } ) => (
    <Polygon
        highlighted
        points={ points }
        onMouseDown={ movement( onMove, onMoveEnd ) } />
) )


class PolygonControl extends React.Component
{
    constructor( props )
    {
        super()

        this.state = { points: props.points || [] }
    }

    componentWillReceiveProps( nextProps )
    {
        if ( nextProps.points !== this.props.points )
        {
            this.setState( { points: nextProps.points } )
        }
    }

    handleMove = ( e, delta ) => {
        const points = this.props.points.map(
            point => move( point, snapToGrid( scale( delta, 1/this.props.zoom ) ) )
        )

        this.setState( { points } )
    }

    handleMovePoint = ( index ) => ( e, delta ) => {
        const zoomDelta = scale( delta, 1/this.props.zoom )

        const points =
        [
            ...this.state.points.slice( 0, index ),
            snapToGrid( move( this.props.points[index], zoomDelta ) ),
            ...this.state.points.slice( index + 1 )
        ]

        this.setState( { points } )
    }

    handleMoveEnd = ( e ) => {
        this.props.onChange( this.state.points, e.ctrlKey )
    }

    render()
    {
        const { points } = this.state

        return (
            <g>
                <DistancePolygon points={ points } />

                <PositionControl
                    points={ points }
                    onMove={ this.handleMove }
                    onMoveEnd={ this.handleMoveEnd } />

                { points.map( ( point, i ) => (
                    <PointControl
                        key={ i }
                        position={ point }
                        onMove={ this.handleMovePoint( i ) }
                        onMoveEnd={ this.handleMoveEnd } />
                ) ) }
            </g>
        )
    }
}


export default PolygonControl
