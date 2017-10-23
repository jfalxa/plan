import React from 'react'
import { Route } from 'react-router-dom'
import Navigation from './Navigation'
import EditStage from './EditStage'
import MoveStage from './MoveStage'


function App()
{
    return (

        <div>
            <Route exact path="/" component={ EditStage } />
            <Route path="/move" component={ MoveStage } />

            <Navigation />
        </div>

    )
}


export default App
