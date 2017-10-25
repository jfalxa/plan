import React from 'react'
import compose from 'lodash/flowRight'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { parse } from 'query-string'

import { initPolygons, panZoom } from '../reducers/stage'


function withURLState( Component )
{
    return class URLState extends React.Component
    {
        componentWillMount()
        {
            const params = parse( this.props.location.search )

            if ( params.p )
            {
                try
                {
                    const polygons = JSON.parse( decodeURIComponent( params.p ) )
                    this.props.initPolygons( polygons )
                }
                catch ( e )
                {
                    console.error( 'Badly formatted polygon' )
                }
            }

        }

        componentWillReceiveProps( nextProps )
        {
            const { polygons, location, history } = this.props

            // update url when polygons change
            if ( nextProps.location.pathname !== location.pathname
                || nextProps.polygons !== polygons )
            {
                history.replace( nextProps.location.pathname + '?p=' + JSON.stringify( nextProps.polygons ) )
            }
        }

        handleReset = () => {
            this.props.initPolygons( [] )
        }

        render()
        {
            return <Component { ...this.props } reset={ this.handleReset } />
        }
    }
}


const withStage = connect(
    state => state.stage,
    { initPolygons, panZoom }
)


export default compose( withRouter, withStage, withURLState )
