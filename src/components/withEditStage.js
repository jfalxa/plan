import { connect } from 'react-redux'
import { editPolygon, addPolygon, replacePolygon, extendPolygon } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    editPolygon,
    addPolygon,
    extendPolygon,
    replacePolygon
}


export default connect( mapStateToProps, actionCreators )
