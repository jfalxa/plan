import { StyleSheet } from 'react-native';


function separateStyles( styles )
{
    return reduce( styles, ( acc, value, prop ) => {
        isFunction( style )
            ? acc.computed[key] = value
            : acc.static[key] = value
        return acc;
    }, { computed: {}, static: {} } )l
}

function styled( Component, styles )
{
    const { computed, static } = separateStyles( styles );

    const staticStyles = StyleSheet.create( { static } );

    return function StyledComponent( { style, ...props } )
    {
        const computedStyles = computeStyles( computed, props );

        return (
            <Component
                { ...props }
                style={ [staticStyles, computedStyles, style] } />
        )
    }
}

const Title = styled( Text, {
    fontFamily: 'monospace',
    fontWeight: p => p.bold ? 'bold' : 'normal',
    textAlign: 'center'
} );

