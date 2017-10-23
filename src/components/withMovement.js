import React from 'react'

import { vector } from '../utils/geometry'


function withMovement( Component )
{
    return class MovementComponent extends React.Component
    {
        state = {
            position: [0, 0]
        }

        startListening( onMove, onMoveEnd )
        {
            this._onMove = onMove
            this._onMoveEnd = onMoveEnd

            document.addEventListener( 'mousemove', this.handleMove )
            document.addEventListener( 'mouseup', this.handleMoveEnd )
        }

        stopListening()
        {
            document.removeEventListener( 'mousemove', this.handleMove )
            document.removeEventListener( 'mouseup', this.handleMoveEnd )
        }

        handleMoveStart = ( onMove, onMoveEnd ) => ( e ) => {
            this.startListening( onMove, onMoveEnd )
            this.setState( { position: [e.clientX, e.clientY] } )
        }

        handleMove = ( e ) => {
            e.stopPropagation()
            const delta = vector( this.state.position, [e.clientX, e.clientY]  )
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
