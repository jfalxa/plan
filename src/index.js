import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'

import Root from './components/Root'
import reducers from './reducers'
import registerServiceWorker from './registerServiceWorker'


const store = createStore( reducers )

ReactDOM.render( <Root store={ store } />, document.getElementById( 'root' ) )
registerServiceWorker()
