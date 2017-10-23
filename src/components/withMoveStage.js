import { connect } from 'react-redux'
import { editPolygon, addPolygon, replacePolygon } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    editPolygon,
    addPolygon,
    replacePolygon
}


export default connect( mapStateToProps, actionCreators )
