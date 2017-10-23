import React from 'react'

import Polygon from './Polygon'
import withMovement from './withMovement'
import { snapToGrid } from '../utils/grid'


const PointControl = withMovement( ( { position, movement, onMove, onMoveEnd } ) => (
    <circle
        r="5"
        fill="red"
        cx={ position[0] }
        cy={ position[1] }
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

    handleMove = ( index ) => ( e ) => {
        const points =
        [
            ...this.state.points.slice( 0, index ),
            snapToGrid( [e.clientX, e.clientY] ),
            ...this.state.points.slice( index + 1 )
        ]

        this.setState( { points } )
    }

    handleMoveEnd = ( e ) => {
        this.props.onChange( this.state.points )
    }

    render()
    {
        const { points } = this.state

        return (
            <g>
                <Polygon highlighted points={ points } />
                { points.map( ( point, i ) => (
                    <PointControl
                        key={ i }
                        position={ point }
                        onMove={ this.handleMove( i ) }
                        onMoveEnd={ this.handleMoveEnd } />
                ) ) }
            </g>
        )
    }
}


export default PolygonControl
