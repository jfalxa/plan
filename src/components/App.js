import React from 'react'
import styled from 'react-emotion'
import { Route } from 'react-router-dom'
import Navigation from './Navigation'
import EditStage from './EditStage'
import MoveStage from './MoveStage'


const AppContainer = styled( 'div' )`
    user-select: none;
`


function App()
{
    return (

        <AppContainer>
            <Route exact path="/" component={ EditStage } />
            <Route path="/move" component={ MoveStage } />

            <Navigation />
        </AppContainer>

    )
}


export default App
