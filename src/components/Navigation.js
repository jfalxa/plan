import React from 'react'
import styled from 'react-emotion'
import { Link, withRouter } from 'react-router-dom'


const NavContainer = styled( 'nav' )`
    position: absolute;
    top: 25px;
    left: 25px;
    display: flex;
    flex-direction: row;
    border: 1px solid black;
`

const ToggleLink = styled( Link )`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: ${ p => p.active ? 'lightgray' : 'white' };
    color: ${ p => p.active ? 'black' : 'lightgray' }
    font-weight: bold;
    text-decoration: none;
`


class Navigation extends React.Component
{
    componentDidMount()
    {
        document.addEventListener( 'keypress', this.toggleRoute )
    }

    componentWillUnmount()
    {
        document.removeEventListener( 'keypress', this.toggleRoute )
    }

    isActive( route )
    {
        return ( this.props.location.pathname === route )
    }

    toggleRoute = ( e ) => {
        // ignore all keys but the spacebar
        if ( e.keyCode === 32 )
        {
            const route = ( this.props.location.pathname === '/' ) ? '/move' : '/'
            this.props.history.push( route )
        }
    }

    render()
    {
        return (
            <NavContainer>
                <ToggleLink to="/" active={ this.isActive( '/' ) }>EDIT</ToggleLink>
                <ToggleLink to="/move" active={ this.isActive( '/move' ) }>MOVE</ToggleLink>
            </NavContainer>
        );
    }
}


export default withRouter( Navigation )
