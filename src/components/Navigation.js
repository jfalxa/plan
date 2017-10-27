import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import withURLState from './withURLState';


import help from '../help'

const NavContainer = styled( 'nav' )`
    position: absolute;
    top: 25px;
    left: 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
`

const LinkContainer = styled( 'div' )`
    display: flex;
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

const RoundButton = styled( 'a' )`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    margin-left: 15px;
    border-radius: 15px;
    background-color: lightgray;
    color: black;
    font-weight: bold;
    text-decoration: none;
`


class Navigation extends React.Component
{
    componentDidMount()
    {
        document.addEventListener( 'keydown', this.handleKeyDown )
    }

    componentWillUnmount()
    {
        document.removeEventListener( 'keydown', this.handleKeyDown )
    }

    isActive( route )
    {
        return ( this.props.location.pathname === route )
    }

    resetViewport = () => {
        this.props.panZoom( [0, 0], 1 )
    }

    clearStage = () => {
        this.props.reset()
        this.resetViewport()
    }

    handleKeyDown = ( e ) => {
        const { history, undo, redo } = this.props;

        if ( e.key === ' ' )
        {
            const route = this.isActive( '/' ) ? '/move' : '/'
            history.push( route )
        }
        else if ( e.ctrlKey )
        {
            if ( e.key === 'z' )
            {
                undo();
            }
            else if ( e.key === 'y' )
            {
                redo();
            }
        }
    }

    render()
    {
        const { undo, redo } = this.props;

        return (
            <NavContainer>
                <LinkContainer>
                    <ToggleLink to="/" active={ this.isActive( '/' ) }>DRAW</ToggleLink>
                    <ToggleLink to="/move" active={ this.isActive( '/move' ) }>MOVE</ToggleLink>
                </LinkContainer>
                <RoundButton title="Clear stage" href='#' onClick={ this.clearStage }>X</RoundButton>
                <RoundButton title="Reset viewport" href='#' onClick={ this.resetViewport }>R</RoundButton>
                <RoundButton title="Undo (ctrl-z)" href="#" onClick={ undo }>↶</RoundButton>
                <RoundButton title="Redo (ctrl-y)" href="#" onClick={ redo }>↷</RoundButton>
                <RoundButton title="Show help" href="#" onClick={ help }>?</RoundButton>
            </NavContainer>
        );
    }
}


export default withURLState( Navigation )
