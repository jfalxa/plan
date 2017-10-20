import React from 'react'
import styled from 'react-emotion'


const Scene = styled( 'svg' )`
    position: absolute;
    top: 0,
    left: 0,
    width: 100%;
    height: 100%;
`


class Truc extends React.Component
{
    render()
    {
        const { polygons } = this.props;

        return (
            <Scene>
                {  }
            </Scene>
        );
    }
}



export default Scene
