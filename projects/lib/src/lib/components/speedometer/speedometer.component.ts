import { AfterViewInit, Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { parsePath, roundCommands } from '@twixes/svg-round-corners';
import { z } from 'zod';
import { ComponentTheme, ZHEXColor } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { PartialCheckboxTheme } from '../checkbox/checkbox.component';

@FeComponent( 'speedometer' )
@Component(
    {
        selector   : 'fe-speedometer',
        templateUrl: './speedometer.component.html',
        styleUrls  : [ './speedometer.component.scss' ]
    }
)
export class SpeedometerComponent implements AfterViewInit {
    
    constructor(
        public hostElement: ElementRef,
        public domSam: DomSanitizer,
        public ngZone: NgZone
    ) {
    }
    
    @Input()
    public feTheme!: ComponentTheme<PartialCheckboxTheme>;
    
    @Input()
    public feRange!: [ number, number ];
    
    @Input()
    public feUnit!: string;
    
    @Input()
    public feLabel!: string;
    
    @Input()
    public set feValue( value: number ) {
        
        this.currentValue = value;
        
        if ( this.foregroundValueEl ) {
            this.updateValue();
        }
    }
    
    @ViewChild( 'foregroundText' )
    public foregroundValueEl!: ElementRef<HTMLSpanElement>;
    
    @ViewChild( 'indicator' )
    public indicatorEl!: ElementRef<SVGCircleElement>;
    
    /* SVG drawing calculations */
    
    public canvasDiameter = 450;
    public canvasRadius   = this.canvasDiameter / 2;
    
    public circleDiameter = 300;
    public circleRadius   = this.circleDiameter / 2;
    
    public outerFrameWidth = 5;
    public innerFrameWidth = 2;
    public indicatorMargin = 15;
    
    public indicatorWidth     = this.canvasRadius - this.circleRadius - this.outerFrameWidth - ( this.indicatorMargin * 2 );
    public indicatorRadius    = this.circleRadius + this.indicatorMargin + ( this.indicatorWidth / 2 );
    public indicatorLength    = Math.PI * 2 * this.indicatorRadius;
    public indicatorMaxLength = this.indicatorLength - ( this.indicatorLength / 360 * 280 );
    
    public indicatorGap = ( ( this.canvasRadius - this.outerFrameWidth - this.indicatorWidth - this.circleRadius ) / 2 );
    
    public xAxis1 = ( this.canvasRadius + 100 ) * Math.cos( 130 * Math.PI / 180.0 ) + this.canvasRadius;
    public yAxis1 = ( this.canvasRadius + 100 ) * Math.sin( 130 * Math.PI / 180.0 ) + this.canvasRadius;
    
    public xAxis2 = ( this.circleRadius - 50 ) * Math.cos( 130 * Math.PI / 180.0 ) + this.canvasRadius;
    public yAxis2 = ( this.circleRadius - 50 ) * Math.sin( 130 * Math.PI / 180.0 ) + this.canvasRadius;
    
    public xAxis3 = ( this.circleRadius - 50 ) * Math.cos( 50 * Math.PI / 180.0 ) + this.canvasRadius;
    public yAxis3 = ( this.circleRadius - 50 ) * Math.sin( 50 * Math.PI / 180.0 ) + this.canvasRadius;
    
    public xAxis4 = ( this.canvasRadius + 100 ) * Math.cos( 50 * Math.PI / 180.0 ) + this.canvasRadius;
    public yAxis4 = ( this.canvasRadius + 100 ) * Math.sin( 50 * Math.PI / 180.0 ) + this.canvasRadius;
    
    public path = roundCommands( parsePath( `M${ this.xAxis1 } ${ this.yAxis1 }
    L ${ this.xAxis2 } ${ this.yAxis2 }
    L ${ this.xAxis3 } ${ this.yAxis3 }
    L ${ this.xAxis4 } ${ this.yAxis4 }` ), 50, 2 ).path;
    
    private indicatorOffsetStart = this.indicatorLength;
    private indicatorOffsetEnd   = this.indicatorMaxLength;
    
    private currentValue?: number;
    
    public ngAfterViewInit(): void {
        this.feValue = Math.min( this.feRange[ 0 ], this.feRange[ 1 ] );
    }
    
    public updateValue(): void {
        
        if ( !this.currentValue ) {
            return;
        }
        
        const min = Math.min( Math.min( this.feRange[ 0 ], this.feRange[ 1 ] ), this.currentValue );
        const max = Math.max( Math.max( this.feRange[ 0 ], this.feRange[ 1 ] ), this.currentValue );
        
        this.animateNumber( this.currentValue );
        
        const p = ( this.currentValue - min ) / ( max - min );
        const w = this.indicatorOffsetStart + ( p * ( this.indicatorOffsetEnd - this.indicatorOffsetStart ) );
        
        this.indicatorEl.nativeElement.style.strokeDashoffset = w + 'px';
    }
    
    public animateNumber( countTo: number ): void {
        
        this.ngZone.runOutsideAngular( () => {
            
            if ( !this.foregroundValueEl ) {
                return;
            }
            
            const duration                    = 500;
            const start                       = +this.foregroundValueEl.nativeElement.innerText;
            let startTimestamp: number | null = null;
            
            const step: FrameRequestCallback = ( timestamp ) => {
                
                if ( !startTimestamp ) {
                    startTimestamp = timestamp;
                }
                
                const progress = Math.min( ( timestamp - startTimestamp ) / duration, 1 );
                
                this.foregroundValueEl.nativeElement.innerText = Math.floor( progress * ( countTo - start ) + start ).toString();
                
                if ( progress < 1 ) {
                    window.requestAnimationFrame( step );
                }
                
            };
            
            window.requestAnimationFrame( step );
        } );
    }
}

export const ZSpeedometerTheme = z.object(
    {
        hud       : ZHEXColor,
        border    : z.object(
            {
                inner: ZHEXColor,
                outer: ZHEXColor
            }
        ),
        indicator : z.object(
            {
                gradientStart: ZHEXColor,
                gradientEnd  : ZHEXColor
            }
        ),
        background: z.object(
            {
                inner: ZHEXColor,
                outer: ZHEXColor
            }
        )
    }
);

export const ZPartialSpeedometerTheme = ZSpeedometerTheme.partial();

export type SpeedometerTheme = z.infer<typeof ZSpeedometerTheme>;
export type PartialSpeedometerTheme = z.infer<typeof ZPartialSpeedometerTheme>;

