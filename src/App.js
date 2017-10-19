import React, { Component } from 'react'
import { css } from 'react-emotion'

const app = css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const indicator = css`
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: #000;
    border-radius: 25px;
`

function Indicator( { position } )
{
    const style =
    {
        top: position[1] - 25,
        left: position[0] - 25
    }

    return <i className={ indicator } style={ style } />
}

function Marks( { positions } )
{
    return positions.map(
        ( position, i ) => <Indicator key={ i } position={ position } />
    )
}

class App extends Component
{
    state = {
        mousePosition: [ 0, 0 ],
        markedSpots: []
    }

    componentDidMount()
    {
        this.startListening()
    }

    componentWillUnmount()
    {
        this.stopListening()
    }

    startListening = () => {
        this._moveCallback = e => this.move( e.clientX, e.clientY )
        document.addEventListener( 'mousemove', this._moveCallback )
    }

    stopListening = () => {
        document.removeEventListener( 'mousemove', this._moveCallback )
    }

    move = ( x, y ) => {
        this.setState( { mousePosition: [ x, y ] } )
    }

    mark = () => {
        const { markedSpots, mousePosition } = this.state
        this.setState( { markedSpots: [...markedSpots, mousePosition] } )
    }

    render()
    {
        const { mousePosition, markedSpots } = this.state

        return (
            <div className={ app } onClick={ this.mark }>
                <Indicator position={ mousePosition } />
                <Marks positions={ markedSpots } />
            </div>
        )
    }
}

export default App
