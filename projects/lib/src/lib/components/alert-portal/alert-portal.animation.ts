import { animate, group, style, transition, trigger } from '@angular/animations';

export const AlertPortalAnimation = [
    
    trigger( 'alert', [
        
        transition( ':enter', [
            
            style(
                {
                    transform   : 'translateX(50px)',
                    height      : '0',
                    opacity     : '0',
                    marginBottom: '0'
                }
            ),
            
            animate( '.5s ease', style(
                {
                    height      : '*',
                    marginBottom: '*'
                }
            ) ),
            
            group(
                [
                    
                    animate( '.5s ease', style(
                        {
                            opacity: '1'
                        }
                    ) ),
                    
                    animate( '.75s cubic-bezier(0, 0.55, 0.45, 1)', style(
                        {
                            transform: 'translateX(0)'
                        }
                    ) )
                ]
            )
        ] ),
        
        transition( ':leave', [
            
            style(
                {
                    height      : '*',
                    marginBottom: '*',
                    opacity     : '1'
                }
            ),
            
            animate( '.5s ease', style(
                {
                    opacity: '0'
                }
            ) ),
            
            animate( '.5s ease', style(
                {
                    height      : '0',
                    marginBottom: '0'
                }
            ) )
        ] )
    ] )
];