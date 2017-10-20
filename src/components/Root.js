import React from 'react';
import { BrowserRouter }  from 'react-router-dom';
import App from './App';


export default function Root()
{
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

