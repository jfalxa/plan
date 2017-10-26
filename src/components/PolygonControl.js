import React from 'react'
import styled from 'react-emotion';
import { createPortal } from 'react-dom';
import Polygon from './Polygon'
import HoverPoint from './HoverPoint'
import DistancePolygon from './DistancePolygon'
import withMovement from './withMovement'
import { move, scale, unproject, rotate90, topLeft } from '../utils/geometry'
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


const Toolbox = styled( 'div' )`
    position: absolute;
    flexDirection: 'row';
    margin-top: -50px;
`

class PolygonControl extends React.Component
{
    constructor( props )
    {
        super()

        this.state = { points: props.points || [] }
        this.portal = document.getElementById( 'portal' )
    }

    componentWillReceiveProps( nextProps )
    {
        if ( nextProps.points !== this.props.points )
        {
            this.setState( { points: nextProps.points } )
        }
    }

    toolboxPosition()
    {
        const { pan, zoom } = this.props
        const position = topLeft( this.state.points )
        const [left, top] = unproject( position, pan, zoom )

        return { top, left }
    }

    handleRotate = ( direction ) => ( e ) => {
        const rotatedPolygon = rotate90( this.state.points, direction )
        this.props.onChange( rotatedPolygon )
    }

    handleOrder = ( direction ) => ( e ) => {
        this.props.onOrder( direction )
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

                { createPortal( (
                    <Toolbox style={ this.toolboxPosition() }>
                        <button onClick={ this.handleRotate( +1 ) }>+90°</button>
                        <button onClick={ this.handleRotate( -1 ) }>-90°</button>
                        <button onClick={ this.handleOrder( +1 ) }>UP</button>
                        <button onClick={ this.handleOrder( -1 ) }>DOWN</button>
                    </Toolbox>
                ), this.portal ) }

            </g>
        )
    }
}


export default PolygonControl
