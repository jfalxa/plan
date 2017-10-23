import React from 'react'


function withMovement( Component )
{
    return class MovementComponent extends React.Component
    {
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
        }

        handleMove = ( e ) => {
            e.stopPropagation()
            this._onMove( e )
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
