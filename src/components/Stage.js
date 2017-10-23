import React from 'react'
import noop from 'lodash/noop'
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
    static defaultProps = {
        onSelect: noop
    }

    handleSelectPolygon = ( index ) => ( e ) => {
        e.stopPropagation()
        this.props.onSelect( index )
    }

    render()
    {
        const { polygons, edited, children, onSelect, ...stageProps } = this.props;

        return (
            <StageContainer { ...stageProps }>
                { polygons.map( ( polygon, i ) => (
                    <Polygon
                        key={ i }
                        index={ i }
                        edited={ i === edited }
                        points={ polygon }
                        onMouseDown={ this.handleSelectPolygon( i ) } />
                ) ) }
                { children }
            </StageContainer>
        );
    }
}


export default Stage

