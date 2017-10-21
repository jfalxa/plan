import update from 'immutability-helper';
import { createAction, handleActions } from 'redux-actions';


export const addPolygon = createAction( 'ADD_POLYGON' )
export const replacePolygon = createAction( 'REPLACE_POLYGON', ( index, polygon ) => [index, polygon] )


function handleAddPolygon( state, action )
{
    return update( state, {
        polygons: { $push: [action.payload] }
    } )
}

function handleReplacePolygon( state, action )
{
    const [index, polygon] = action.payload

    return update( state, {
        polygons: { $splice: [[index, 1, polygon]] }
    } )
}


const initialState =
{
    polygons: []
}

const reducerMap =
{
    [addPolygon]: handleAddPolygon,
    [replacePolygon]: handleReplacePolygon
}

export default handleActions( reducerMap, initialState )
