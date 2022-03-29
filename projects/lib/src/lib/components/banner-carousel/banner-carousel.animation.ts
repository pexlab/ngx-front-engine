import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations';

export const BannerCarouselAnimation = trigger( 'carousel', [

    transition( ':enter', [

        style(
            {
                position: 'absolute',
                top     : '-25%',
                opacity : '0'
            }
        ),

        group(
            [

                animate( '.25s ease', style(
                    {
                        opacity: '1'
                    }
                ) ),

                animate( '.6s ease', style(
                    {
                        position: 'absolute',
                        top     : '50%'
                    }
                ) )
            ]
        )
    ] ),

    transition( ':leave', [

        style(
            {
                position: 'absolute',
                top     : '50%',
                opacity : '1'
            }
        ),

        group( [

            animate( '.25s ease', style(
                {
                    opacity: '0'
                }
            ) ),

            animate( '.6s ease', style(
                {
                    position: 'absolute',
                    top     : '75%'
                }
            ) )
        ] )
    ] )
] );

export const BannerCarouselImageAnimation = trigger( 'image', [

    transition( ':enter', [

        style(
            {
                transform: 'scale(1.2)',
                opacity  : '0'
            }
        ),

        animate( '.6s cubic-bezier(0.65, 0, 0.35, 1)', style(
            {
                transform: 'scale(1)',
                opacity  : '1'
            }
        ) )
    ] ),

    transition( ':leave', [

        style(
            {
                transform: 'scale(1)',
                opacity  : '1'
            }
        ),

        animate( '.6s cubic-bezier(0.65, 0, 0.35, 1)', style(
            {
                transform: 'scale(0.8)',
                opacity  : '0'
            }
        ) )
    ] )
] );

export const BannerCarouselButtonAnimation = trigger( 'buttons', [

    transition( ':enter', [

        query( ':enter', [

            style(
                {
                    position : 'static',
                    transform: 'translateY(-20px)',
                    opacity  : '0'
                }
            )
        ], { optional: true } ),

        style(
            {
                width     : '0',
                marginLeft: '0'
            }
        ),

        animate( '.5s cubic-bezier(0.22, 1, 0.36, 1)', style(
            {
                width     : '*',
                marginLeft: '*'
            }
        ) ),

        query( ':enter', [

            stagger( 100, [

                animate( '.5s cubic-bezier(0.22, 1, 0.36, 1)', style(
                    {
                        opacity  : '1',
                        transform: 'translateY(0)'
                    }
                ) )
            ] )
        ], { optional: true } )
    ] ),

    transition( ':leave', [

        query( ':leave', animate( '.5s ease', style(
                {
                    opacity  : '0',
                    transform: 'translateY(0) scale(0.9)'
                }
            ) )
        ),

        animate( '.5s cubic-bezier(0.22, 1, 0.36, 1)', style(
            {
                width     : '0',
                marginLeft: '0'
            }
        ) )
    ] ),

    transition( '* <=> *', [

        group(
            [

                /* While other elements are leaving, hold back the new ones */
                query( ':enter', [
                    style(
                        {
                            position : 'absolute',
                            transform: 'translateY(-20px)',
                            opacity  : '0'
                        }
                    )
                ], { optional: true } ),

                query( ':leave', [

                    style(
                        {
                            opacity  : '1',
                            transform: 'translateY(0) scale(1)'
                        }
                    ),

                    animate( '.5s ease', style(
                        {
                            opacity  : '0',
                            transform: 'translateY(0) scale(0.9)'
                        }
                    ) ),

                    style(
                        {
                            position: 'absolute',

                            width : '0',
                            height: '0',

                            opacity: '0'
                        }
                    )
                ], { optional: true } )
            ]
        ),

        group(
            [

                query( ':enter', [

                    style(
                        {
                            position : 'static',
                            transform: 'translateY(-20px)',
                            opacity  : '0'
                        }
                    )
                ], { optional: true } ),

                query( ':enter', [

                    stagger( 100, [

                        animate( '.5s cubic-bezier(0.22, 1, 0.36, 1)', style(
                            {
                                opacity  : '1',
                                transform: 'translateY(0)'
                            }
                        ) )
                    ] )
                ], { optional: true } )
            ]
        )
    ] )
] );
