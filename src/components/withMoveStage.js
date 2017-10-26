import { connect } from 'react-redux'
import { editPolygon, addPolygon, replacePolygon, orderPolygon, panZoom } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    editPolygon,
    addPolygon,
    replacePolygon,
    orderPolygon,
    panZoom
}


export default connect( mapStateToProps, actionCreators )
