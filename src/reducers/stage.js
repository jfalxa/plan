import update from 'immutability-helper';
import { createAction, handleActions } from 'redux-actions';


export const addPolygon = createAction( 'ADD_POLYGON' )


function handleAddPolygon( state, action )
{
    return update( state, {
        polygons: { $push: [action.payload] }
    } )
}


const initialState =
{
    polygons: []
}

const reducerMap =
{
    [addPolygon]: handleAddPolygon
}

export default handleActions( reducerMap, initialState )
