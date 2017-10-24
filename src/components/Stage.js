import React from 'react'
import { css } from 'react-emotion'

import withPanZoomControls from './withPanZoomControls'
import { toViewBox } from '../utils/svg'


const stageContainer = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

class Stage extends React.Component
{
    static defaultProps = {
        onPanZoom: () => {}
    }

    render()
    {
        const { pan, zoom, panZoom, startPanZoom, resetPanZoom, onPanZoom, children, ...stageProps } = this.props;

        return (
            <svg
                { ...stageProps }
                className={ stageContainer }
                viewBox={ toViewBox( pan, zoom ) }
                onWheel={ panZoom( onPanZoom ) }
                onMouseDown={ startPanZoom( onPanZoom ) }>

                { children }

            </svg>
        );
    }
}


export default withPanZoomControls( Stage )
