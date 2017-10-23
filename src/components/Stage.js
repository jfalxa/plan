import React from 'react'
import styled from 'react-emotion'

import Polygon from './Polygon'


const StageContainer = styled( 'svg' )`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: ${ p => p.edited ? 'crosshair' : 'pointer' };
`


class Stage extends React.Component
{
    handleSelectPolygon = ( index ) => ( e ) => {
        e.stopPropagation()
        this.props.onSelect( index )
    }

    render()
    {
        const { polygons, highlighted, children, onSelect, ...stageProps } = this.props;

        return (
            <StageContainer { ...stageProps }>
                { polygons.map( ( polygon, i ) => (
                    <Polygon
                        key={ i }
                        index={ i }
                        highlighted={ i === highlighted }
                        points={ polygon }
                        onClick={ this.handleSelectPolygon( i ) } />
                ) ) }
                { children }
            </StageContainer>
        );
    }
}


export default Stage

