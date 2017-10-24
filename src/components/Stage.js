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

                <line
                    x1="-10000" y1="0"
                    x2="10000" y2="0"
                    stroke="#ccc"
                    strokeWidth="1" />

                <line
                    x1="0" y1="-10000"
                    x2="0" y2="10000"
                    stroke="#ccc"
                    strokeWidth="1" />


                { children }

            </svg>
        );
    }
}


export default withPanZoomControls( Stage )
