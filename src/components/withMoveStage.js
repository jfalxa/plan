import { connect } from 'react-redux'
import { replacePolygon } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    replacePolygon
}


export default connect( mapStateToProps, actionCreators )
