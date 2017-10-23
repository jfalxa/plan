import React from 'react'
import { Route } from 'react-router-dom'
import EditStage from './EditStage'
import MoveStage from './MoveStage'


function App()
{
    return (

        <div>
            <Route path="/" component={ EditStage } />
            <Route path="/move" component={ MoveStage } />
        </div>

    )
}


export default App
