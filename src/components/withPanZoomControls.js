import React from 'react'
import compose from 'lodash/flowRight'

import withMovement from './withMovement'
import { move, subtract, scale } from '../utils/geometry'


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

            const { pan:prevPan, zoom:prevZoom } = this.state

            const position = [e.clientX, e.clientY]
            const mouseDelta = subtract( delta, this._delta )

            const [deltaX, deltaY] = scale( [
                e.deltaX / 3 || mouseDelta[0] || 0,
                e.deltaY / 3 || mouseDelta[1] || 0
            ], 1/prevZoom )

            this._delta = delta

            const zoom = e.ctrlKey
                ? computeZoom( prevZoom, -deltaY )
                : prevZoom

            const pan = e.ctrlKey
                ? move( prevPan, subtract( scale( position, 1/zoom ), scale( position, 1/prevZoom ) ) )
                : move( prevPan, [deltaX, deltaY] )

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
