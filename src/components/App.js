import React from 'react'
import { Route } from 'react-router-dom'
import Navigation from './Navigation'
import EditStage from './EditStage'
import MoveStage from './MoveStage'


function App()
{
    return (

        <div>
            <Route path="/" component={ MoveStage } />
            <Route path="/edit" component={ EditStage } />

            <Navigation />
        </div>

    )
}


export default App
