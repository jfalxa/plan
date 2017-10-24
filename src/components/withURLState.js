import React from 'react'
import compose from 'lodash/flowRight'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { parse } from 'query-string'

import { initPolygons } from '../reducers/stage'


function withURLState( Component )
{
    return class URLState extends React.Component
    {
        componentWillMount()
        {
            const params = parse( this.props.location.search )

            if ( params.p )
            {
                this.props.initPolygons( JSON.parse( params.p ) )
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


const withPolygons = connect(
    state => ( { polygons: state.stage.polygons } ),
    { initPolygons }
)


export default compose( withRouter, withPolygons, withURLState )
