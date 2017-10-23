import { connect } from 'react-redux'
import { addPolygon, replacePolygon, extendPolygon } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    addPolygon,
    extendPolygon,
    replacePolygon
}


export default connect( mapStateToProps, actionCreators )
