import update from 'immutability-helper'
import { createAction, handleActions } from 'redux-actions'

import { combinePolygons } from '../utils/geometry'


export const addPolygon = createAction( 'ADD_POLYGON' )
export const extendPolygon = createAction( 'EXTEND_POLYGON', ( index, points ) => [index, points] )
export const replacePolygon = createAction( 'EXTEND_POLYGON', ( index, polygon ) => [index, polygon] )


function handleAddPolygon( state, action )
{
    return update( state, {
        polygons: { $push: [action.payload] }
    } )
}

function handleExtendPolygon( state, action )
{
    const [index, points] = action.payload
    const polygon = combinePolygons( state.polygons[index], points )

    return update( state, {
        polygons: { $splice: [[index, 1, polygon]] }
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
    [extendPolygon]: handleExtendPolygon,
    [replacePolygon]: handleReplacePolygon
}

export default handleActions( reducerMap, initialState )
