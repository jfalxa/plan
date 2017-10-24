import update from 'immutability-helper'
import { createAction, handleActions } from 'redux-actions'

import { clockwise, combinePolygons } from '../utils/geometry'


export const initPolygons = createAction( 'INIT_POLYGONS' )
export const editPolygon = createAction( 'EDIT_POLYGON' )
export const addPolygon = createAction( 'ADD_POLYGON' )
export const extendPolygon = createAction( 'EXTEND_POLYGON', ( index, points ) => [index, points] )
export const replacePolygon = createAction( 'REPLACE_POLYGON', ( index, polygon ) => [index, polygon] )


function handleInitPolygons( state, action )
{
    return update( state, {
        editedPolygon: { $set: null },
        polygons: { $set: action.payload }
    } )
}

function handleEditPolygon( state, action )
{
    return update( state, {
        editedPolygon: { $set: action.payload }
    } )
}

function handleAddPolygon( state, action )
{
    return update( state, {
        editedPolygon: { $set: state.polygons.length },
        polygons: { $push: [clockwise( action.payload )] }
    } )
}

function handleExtendPolygon( state, action )
{
    const [index, points] = action.payload
    const polygon = combinePolygons( state.polygons[index], points )

    return update( state, {
        polygons: { $splice: [[index, 1, clockwise( polygon )]] }
    } )
}

function handleReplacePolygon( state, action )
{
    const [index, polygon] = action.payload

    // if there is no replacement polygon or if it's (almost) empty
    const isEmpty = ( !polygon || polygon.length <=1 )

    // remove it from the list
    // otherwise add the new one
    const spliceArgs = isEmpty
        ? [index, 1]
        : [index, 1, clockwise( polygon )]

    // if the polygon is empty and it was the edited one, reset selection
    const editedPolygon = ( isEmpty && state.editedPolygon === index )
        ? null
        : state.editedPolygon

    return update( state, {
        editedPolygon: { $set: editedPolygon },
        polygons: { $splice: [spliceArgs] }
    } )
}


const initialState =
{
    editedPolygon: null,
    polygons: []
}

const reducerMap =
{
    [initPolygons]: handleInitPolygons,
    [editPolygon]: handleEditPolygon,
    [addPolygon]: handleAddPolygon,
    [extendPolygon]: handleExtendPolygon,
    [replacePolygon]: handleReplacePolygon
}

export default handleActions( reducerMap, initialState )
