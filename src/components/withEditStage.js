import { connect } from 'react-redux'
import { addPolygon } from '../reducers/stage'


function mapStateToProps( state )
{
    return state.stage
}

const actionCreators =
{
    addPolygon
}


export default connect( mapStateToProps, actionCreators )
