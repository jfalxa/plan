import { combineReducers } from 'redux'
import undoable from 'redux-undo';


import stageReducer from './stage'


export default combineReducers( {
    stage: undoable(stageReducer)
} )
