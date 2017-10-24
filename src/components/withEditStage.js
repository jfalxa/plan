import { connect } from 'react-redux'
import { editPolygon, addPolygon, replacePolygon, extendPolygon, panZoom } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    editPolygon,
    addPolygon,
    extendPolygon,
    replacePolygon,
    panZoom
}


export default connect( mapStateToProps, actionCreators )
