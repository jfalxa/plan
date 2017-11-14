import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { HotKeys } from 'react-hotkeys'

import withURLState from './withURLState'
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
    cursor: pointer;
`

class Navigation extends React.Component
{
    hotkeys = {
        'space': () => this.toggleMode(),
        'ctrl+z': this.props.undo,
        'ctrl+y': this.props.redo,
        '?': help
    }

    isActive( route )
    {
        return ( this.props.location.pathname === route )
    }

    toggleMode()
    {
        const route = this.isActive( '/' ) ? '/move' : '/'
        this.props.history.push( route )
    }

    resetViewport = () => {
        const width = -(document.body.offsetWidth / 2);
        const height =  -(document.body.offsetHeight / 2);

        this.props.panZoom( [width, height], 1 )
    }

    clearStage = () => {
        this.props.reset()
        this.resetViewport()
    }

    render()
    {
        const { undo, redo } = this.props;

        return (
            <HotKeys focused attach={ document } handlers={ this.hotkeys }>
                <NavContainer>
                    <LinkContainer>
                        <ToggleLink to="/" active={ this.isActive( '/' ) }>DRAW</ToggleLink>
                        <ToggleLink to="/move" active={ this.isActive( '/move' ) }>MOVE</ToggleLink>
                    </LinkContainer>
                    <RoundButton title="Clear stage" onClick={ this.clearStage }>X</RoundButton>
                    <RoundButton title="Reset viewport" onClick={ this.resetViewport }>R</RoundButton>
                    <RoundButton title="Undo (ctrl-z)" onClick={ undo }>↶</RoundButton>
                    <RoundButton title="Redo (ctrl-y)" onClick={ redo }>↷</RoundButton>
                    <RoundButton title="Show help" onClick={ help }>?</RoundButton>
                </NavContainer>
            </HotKeys>
        );
    }
}


export default withURLState( Navigation )
