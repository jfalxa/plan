import { connect } from 'react-redux'
import { editPolygon, addPolygon, replacePolygon, panZoom } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    editPolygon,
    addPolygon,
    replacePolygon,
    panZoom
}


export default connect( mapStateToProps, actionCreators )
