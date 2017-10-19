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

class App extends Component
{
    state =
    {
        mousePosition: [ 0, 0 ]
    }

    componentDidMount()
    {
        this.startListening();
    }

    move = ( x, y ) =>
    {
        this.setState( { mousePosition: [ x, y ] } )
    }

    startListening = () =>
    {
        document.addEventListener( 'mousemove', e => this.move( e.clientX, e.clientY ) )
    }

    stopListening = () =>
    {
        document.removeEventListener( 'mousemove' );
    }

    render()
    {
        return (
            <div className={app}>
                <Indicator position={ this.state.mousePosition } />
            </div>
        )
    }
}

export default App
