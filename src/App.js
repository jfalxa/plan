import React, { Component } from 'react'
import { css } from 'react-emotion'
import * as geometry from './geometry'

const app = css`
    width: 100%;
    height: 100%;
`
const indicator = css`
    r: 40;
    fill: black;
`
const path = css`
    stroke: red;
    stroke-width: 3;
    fill: white;
`

const big = css`
    r: 60;
    fill: red;
`

const gray = css`
    stroke: lightgray;
    fill: #f5f5f5;
`


function Indicator( { position, className } )
{
    return (
        <circle
            cx={ position[0] }
            cy={ position[1] }
            className={ className + ' ' + indicator } />
    )
}


function BigIndicator( { position } )
{
    return <Indicator className={ big } position={ position } />
}


function Marks( { positions } )
{
    return positions.map( ( position, i ) => <Indicator key={ i } position={ position } /> )
}


function Polygon( { points, className } )
{
    const [first, ...rest] = points;

    const firstCommand = `M${ first[0] } ${ first[1] }`
    const restCommands = rest.map( point => `L${ point[0] } ${ point[1] }` )

    return (
        <path
            onClick={ e => console.log( 'homypoly' ) }
            className={ className + ' ' + path }
            d={ firstCommand + ' ' + rest + ' Z' } />
    )
}


function PolyList( { polygons } )
{
    return polygons.map( ( poly, i ) => <Polygon key={ i } points={ poly } className={ gray } /> )
}


class App extends Component
{
    state = {
        canEdit: false,
        canClose: false,
        mousePosition: [ 0, 0 ],
        markedSpots: [],
        polygons: []
    }

    componentDidMount()
    {
        this.startListening()
    }

    componentWillUnmount()
    {
        this.stopListening()
    }

    isCloseToOrigin( point )
    {
        return this.state.markedSpots.length > 0
            ? geometry.isNearby( point, this.state.markedSpots[0], 25 )
            : false
    }

    startListening = () => {
        this._moveCallback = e => this.move( e.clientX, e.clientY )
        document.addEventListener( 'mousemove', this._moveCallback )
    }

    stopListening = () => {
        document.removeEventListener( 'mousemove', this._moveCallback )
    }

    toggleEdit = () => {
        this.setState( { canEdit: !this.state.canEdit } )
    }

    move = ( x, y ) => {
        const mousePosition = [ x, y ]
        const canClose = this.isCloseToOrigin( mousePosition )
        this.setState( { mousePosition, canClose } )
    }

    mark = ( e ) => {
        const { canClose, markedSpots, polygons, mousePosition } = this.state

        // when user clicks on the first point
        if ( canClose )
        {
            // actually close the polygon and add it to the collection
            this.setState( { canClose: false, markedSpots: [], polygons: [...polygons, markedSpots] } )
        }
        // when user clicks on the stage
        else
        {
            this.setState( { markedSpots: [...markedSpots, mousePosition] } )
        }
    }

    pop = ( e ) => {
        e.preventDefault()
        this.setState( { markedSpots: this.state.markedSpots.slice( 0, -1 ) } )
    }

    render()
    {
        const { canClose, polygons, mousePosition, markedSpots } = this.state

        return (
            <svg
                className={ app }
                onClick={ this.mark }
                onContextMenu={ this.pop }>
                <PolyList polygons={ polygons } />
                <Polygon points={ [...markedSpots, mousePosition] } />
                <Indicator position={ mousePosition } />
                <Marks positions={ markedSpots } />
                { canClose && <BigIndicator position={ markedSpots[0] } /> }
            </svg>
        )
    }
}

export default App
