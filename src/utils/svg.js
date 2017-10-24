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


export function toViewBox( pan, zoom )
{
    return `${ pan[0] } ${ pan[1] } ${ document.body.offsetWidth / zoom } ${ document.body.offsetHeight / zoom }`
}

