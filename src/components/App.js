import React from 'react';
import { Route } from 'react-router-dom';
import EditScene from './EditScene';


function App()
{
    return (

        <div>
            <Route path="/edit" component={ EditScene } />
        </div>

    )
}


export default EditScene;
