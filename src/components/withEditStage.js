import { connect } from 'react-redux'
import { addPolygon, extendPolygon } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    addPolygon,
    extendPolygon
}


export default connect( mapStateToProps, actionCreators )
