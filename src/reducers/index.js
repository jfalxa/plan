import { combineReducers } from 'redux';

import stageReducer from './stage';


export default combineReducers( {
    stage: stageReducer
} )
