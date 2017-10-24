import React from 'react'
import noop from 'lodash/noop'

import { subtract } from '../utils/geometry'


function withMovement( Component )
{
    return class MovementComponent extends React.Component
    {
        position = [0, 0]

        startListening( onMove, onMoveEnd )
        {
            this._onMove = onMove || noop
            this._onMoveEnd = onMoveEnd || noop

            document.addEventListener( 'mousemove', this.handleMove )
            document.addEventListener( 'mouseup', this.handleMoveEnd )
        }

        stopListening()
        {
            document.removeEventListener( 'mousemove', this.handleMove )
            document.removeEventListener( 'mouseup', this.handleMoveEnd )
        }

        handleMoveStart = ( onMove, onMoveEnd ) => ( e ) => {
            e.stopPropagation()
            this.startListening( onMove, onMoveEnd )
            this.position = [e.clientX, e.clientY]
        }

        handleMove = ( e ) => {
            e.stopPropagation()
            const delta = subtract( this.position, [e.clientX, e.clientY]  )
            this._onMove( e, delta )
        }

        handleMoveEnd = ( e ) => {
            e.stopPropagation()
            this._onMoveEnd( e )
            this.stopListening()
        }

        render()
        {
            return (
                <Component
                    { ...this.props }
                    movement={ this.handleMoveStart } />
            )
        }
    }

}


export default withMovement
