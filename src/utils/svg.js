export function toPath( [first, ...rest], opened )
{
    if ( !first )
    {
        return ''
    }

    const firstCommand = `M${ first[0] } ${ first[1] }`
    const restCommands = rest.map( point => `L${ point[0] } ${ point[1] }` )

    return `${ firstCommand } ${ restCommands.join( ' ' ) } ${ opened ? '' : 'Z' }`
}

