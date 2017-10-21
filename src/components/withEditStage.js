import { connect } from 'react-redux'
import { addPolygon, replacePolygon } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    addPolygon,
    replacePolygon
}


export default connect( mapStateToProps, actionCreators )
