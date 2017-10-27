import update from 'immutability-helper'
import undoable, { excludeAction } from 'redux-undo';
import { createAction, handleActions } from 'redux-actions'

import { clockwise, combinePolygons } from '../utils/geometry'


export const initPolygons = createAction( 'INIT_POLYGONS' )
export const editPolygon = createAction( 'EDIT_POLYGON' )
export const addPolygon = createAction( 'ADD_POLYGON' )
export const extendPolygon = createAction( 'EXTEND_POLYGON', ( index, points ) => [index, points] )
export const replacePolygon = createAction( 'REPLACE_POLYGON', ( index, polygon ) => [index, polygon] )
export const orderPolygon = createAction( 'ORDER_POLYGON', ( index, direction ) => [index, direction] )
export const panZoom = createAction( 'PAN_ZOOM', ( pan, zoom ) => [pan, zoom] )


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

function handleOrderPolygon( state, action )
{
    const [index, direction] = action.payload
    const replacedIndex = ( index + direction )

    if ( replacedIndex === -1 || replacedIndex === state.polygons.length )
    {
        return state
    }

    const before = ( direction < 0 )

    const ordered = state.polygons[index]
    const replaced = state.polygons[replacedIndex]

    const spliceArgs = [
        before ? replacedIndex : index,
        2,
        before ? ordered : replaced,
        before ? replaced : ordered
    ]

    return update( state, {
        editedPolygon: { $set: replacedIndex },
        polygons: { $splice: [spliceArgs] }
    } )
}

function handlePanZoom( state, action )
{
    const [pan, zoom] = action.payload

    return update( state, {
        pan: { $set: pan || state.pan },
        zoom: { $set: zoom || state.zoom }
    } )
}


const initialState =
{
    editedPolygon: null,
    polygons: [],
    pan: [0, 0],
    zoom: 1
}

const reducerMap =
{
    [initPolygons]: handleInitPolygons,
    [editPolygon]: handleEditPolygon,
    [addPolygon]: handleAddPolygon,
    [extendPolygon]: handleExtendPolygon,
    [replacePolygon]: handleReplacePolygon,
    [orderPolygon]: handleOrderPolygon,
    [panZoom]: handlePanZoom
}

const stageReducer = handleActions( reducerMap, initialState )
const undoExclude = [initPolygons, panZoom].map( action => action.toString() )

export default undoable( stageReducer, { filter: excludeAction( undoExclude ) } );
