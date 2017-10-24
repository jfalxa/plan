import React from 'react'
import compose from 'lodash/flowRight'

import withMovement from './withMovement'
import { move } from '../utils/geometry'

function computeZoom( zoom, modifier )
{
    return Math.max( 0.1, Math.min( zoom + modifier/300, 3 ) )
}

function withPanZoomControls( Component )
{
    return class PanZoomComponent extends React.Component
    {
        _delta = [0, 0]

        constructor( props )
        {
            super()

            this.state =
            {
                pan: props.pan || [0, 0],
                zoom: props.zoom || 1
            }
        }

        componentWillReceiveProps( nextProps )
        {
            if ( nextProps.pan !== this.props.pan || nextProps.zoom !== this.props.zoom )
            {
                this.setState( { pan: nextProps.pan, zoom: nextProps.zoom } )
            }
        }

        resetPanZoom = () => {
            this.setState( { pan: [0, 0], zoom: 1 } )
        }

        handlePanZoom = ( onPanZoom ) => ( e, delta=[] ) => {
            e.preventDefault()
            e.stopPropagation()

            const deltaX = e.deltaX || this._delta[0] - delta[0] || 0
            const deltaY = e.deltaY || this._delta[1] - delta[1] || 0

            this._delta = delta

            const zoom = e.ctrlKey
                ? computeZoom( this.state.zoom, -deltaY )
                : this.state.zoom

            const pan = !e.ctrlKey
                ? move( this.state.pan, [deltaX, deltaY] )
                : this.state.pan

            onPanZoom( pan, zoom )
            this.setState( { pan, zoom } )
        }

        handlePanZoomEnd = ( e ) => {
            this._delta = [0, 0]
        }

        render()
        {
            const { pan, zoom } = this.state
            const { movement, ...props } = this.props

            return (
                <Component
                    { ...props }
                    pan={ pan }
                    zoom={ zoom }
                    panZoom={ this.handlePanZoom }
                    startPanZoom={ onPanZoom => movement( this.handlePanZoom( onPanZoom ), this.handlePanZoomEnd ) }
                    resetPanZoom={ this.resetPanZoom } />
            )
        }
    }
}


export default compose( withMovement, withPanZoomControls )
