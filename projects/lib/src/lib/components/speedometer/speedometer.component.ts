import { AfterViewInit, Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { parsePath, roundCommands } from 'svg-round-corners';
import { customAlphabet } from 'nanoid';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { SVGUtil } from '../../utils/svg.utils';
import { PartialSpeedometerTheme } from './speedometer.theme';

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
    public feTheme!: ComponentTheme<PartialSpeedometerTheme>;

    @Input()
    public feRange!: [ number, number ];

    @Input()
    public feDiameter!: number;

    @Input()
    public feStepSize!: [ number, number ];

    @Input()
    public feMarkers!: number[];

    @Input()
    public feUnit!: string;

    @Input()
    public feLabelPrimary?: string;

    @Input()
    public feLabelSecondary?: string;

    @Input()
    public feFractions = 0;

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

    public svgUtil = SVGUtil;

    /* SVG drawing ids (to encapsulate defs and not affect other instances of the speedometer) */
    private generateId           = customAlphabet( 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 24 );
    public indicatorGradientId   = this.generateId();
    public innerFrameGradientId  = this.generateId();
    public innerCircleGradientId = this.generateId();
    public circleId              = this.generateId();

    /* SVG drawing calculations */

    public canvasRadius!: number;

    public innerCircleDiameter!: number;
    public innerCircleRadius!: number;

    public outerFrameWidth!: number;
    public innerFrameWidth!: number;
    public indicatorMargin!: number;

    public stepStrokeWidth!: number;
    public interimStepStrokeWidth!: number;
    public stepStrokeLength!: number;
    public interimStepStrokeLength!: number;
    public stepTextCircleRadius!: number;

    public hudStrokeWidth!: number;

    public indicatorStartDegree!: number;
    public indicatorEndDegree!: number;

    public indicatorWidth!: number;
    public indicatorRadius!: number;
    public indicatorLength!: number;
    public indicatorMaxLength!: number;

    public indicatorGap!: number;

    public xAxis1Hud!: number;
    public yAxis1Hud!: number;

    public xAxis2Hud!: number;
    public yAxis2Hud!: number;

    public xAxis3Hud!: number;
    public yAxis3Hud!: number;

    public xAxis4Hud!: number;
    public yAxis4Hud!: number;

    public hudPath!: string;

    public stepPaths!: string[];
    public interimStepPaths!: string[];

    public stepTexts!: { offset: number, text: string }[];

    public indicatorMarkerRotateDegree!: number;
    public indicatorMarkerWidth!: number;
    public indicatorMarkerHeight!: number;
    public indicatorMarkerCX!: number;
    public indicatorMarkerY!: number;

    public indicatorMarkerPath!: string;

    public markers!: { path: string, rotateDegree: number, width: number, height: number, cx: number, y: number }[]

    private indicatorOffsetStart!: number;
    private indicatorOffsetEnd!: number;

    public bottomTextBottomOffset!: number;
    public bottomLength!: number;

    private currentValue?: number;

    public ngOnInit(): void {
        this.generateId            = customAlphabet( 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 24 );
        this.indicatorGradientId   = this.generateId();
        this.innerFrameGradientId  = this.generateId();
        this.innerCircleGradientId = this.generateId();
        this.circleId              = this.generateId();

        this.canvasRadius = this.feDiameter / 2;

        this.innerCircleDiameter = this.feDiameter / 1.5; //1.5 Ratio between feDiameter and innerCircleDiameter
        this.innerCircleRadius   = this.innerCircleDiameter / 2;

        this.outerFrameWidth = this.feDiameter / 90; //90 Ratio between outerFrameWidth and indicatorMargin
        this.innerFrameWidth = this.feDiameter / 225; //225 Ratio between innerFrameWidth and indicatorMargin
        this.indicatorMargin = this.feDiameter / 30; //30 Ratio between canvasDiameter and indicatorMargin

        this.stepStrokeWidth         = this.feDiameter / ( 450 / 3 ); // (450 / 3) Ratio between default feDiameter and default stepStrokeWidth
        this.interimStepStrokeWidth  = this.feDiameter / ( 450 / 2 ); // (450 / 2) Ratio between default feDiameter and default interimStepStrokeWidth
        this.stepStrokeLength        = this.feDiameter / ( 450 / 15 ); // (450 / 15) Ratio between default feDiameter and default STEP_STROKE_LENGTH
        this.interimStepStrokeLength = this.feDiameter / ( 450 / 7.5 ); // (450 / 7.5) Ratio between default feDiameter and default INTERIM_STEP_STOKE_LENGTH
        this.stepTextCircleRadius = this.innerCircleRadius - this.stepStrokeLength;

        this.hudStrokeWidth = this.feDiameter / ( 450 / 3 ); // (450 / 3) Ratio between default feDiameter and default hudStrokeWidth

        this.indicatorStartDegree = 130;
        this.indicatorEndDegree   = 50;

        this.indicatorWidth     = this.canvasRadius - this.innerCircleRadius - this.outerFrameWidth - ( this.indicatorMargin * 2 );
        this.indicatorRadius    = this.innerCircleRadius + this.indicatorMargin + ( this.indicatorWidth / 2 );
        this.indicatorLength    = Math.PI * 2 * this.indicatorRadius;
        this.indicatorMaxLength = this.indicatorLength - ( this.indicatorLength / 360 * 280 );

        this.indicatorGap = ( ( this.canvasRadius - this.outerFrameWidth - this.indicatorWidth - this.innerCircleRadius ) / 2 );

        this.xAxis1Hud = ( this.canvasRadius - this.outerFrameWidth ) * Math.cos( this.degToRad( this.indicatorStartDegree ) ) + this.canvasRadius;
        this.yAxis1Hud = ( this.canvasRadius - this.outerFrameWidth ) * Math.sin( this.degToRad( this.indicatorStartDegree ) ) + this.canvasRadius;

        this.xAxis2Hud = ( this.innerCircleRadius - ( this.feDiameter / 9 ) ) * Math.cos( this.degToRad( this.indicatorStartDegree ) ) + this.canvasRadius;
        this.yAxis2Hud = ( this.innerCircleRadius - ( this.feDiameter / 9 ) ) * Math.sin( this.degToRad( this.indicatorStartDegree ) ) + this.canvasRadius;

        this.xAxis3Hud = ( this.innerCircleRadius - ( this.feDiameter / 9 ) ) * Math.cos( this.degToRad( this.indicatorEndDegree ) ) + this.canvasRadius;
        this.yAxis3Hud = ( this.innerCircleRadius - ( this.feDiameter / 9 ) ) * Math.sin( this.degToRad( this.indicatorEndDegree ) ) + this.canvasRadius;

        this.xAxis4Hud = ( this.canvasRadius - this.outerFrameWidth ) * Math.cos( this.degToRad( this.indicatorEndDegree ) ) + this.canvasRadius;
        this.yAxis4Hud = ( this.canvasRadius - this.outerFrameWidth ) * Math.sin( this.degToRad( this.indicatorEndDegree ) ) + this.canvasRadius;

        this.hudPath = roundCommands( parsePath( `M${ this.xAxis1Hud } ${ this.yAxis1Hud }
    L ${ this.xAxis2Hud } ${ this.yAxis2Hud }
    L ${ this.xAxis3Hud } ${ this.yAxis3Hud }
    L ${ this.xAxis4Hud } ${ this.yAxis4Hud }` ), this.feDiameter / 9, 2 ).path;

        this.stepPaths        = [];
        this.interimStepPaths = [];

        this.stepTexts = [];

        this.indicatorMarkerRotateDegree = 0;
        this.indicatorMarkerWidth        = this.feDiameter / 22.5;
        this.indicatorMarkerHeight       = this.feDiameter / 22.5;
        this.indicatorMarkerCX           = this.canvasRadius + ( Math.cos( 90 * Math.PI / 180.0 ) * ( this.innerCircleRadius - ( this.innerFrameWidth / 2 ) ) ) - ( this.indicatorMarkerWidth / 2 );
        this.indicatorMarkerY            = this.canvasRadius + ( Math.sin( 90 * Math.PI / 180.0 ) * ( this.innerCircleRadius - ( this.innerFrameWidth / 2 ) ) );

        this.indicatorMarkerPath = `M ${ this.indicatorMarkerWidth / 2 } ${ this.indicatorMarkerHeight } L 0 0 L ${ this.indicatorMarkerWidth } 0 Z`;

        this.markers = [];

        this.indicatorOffsetStart = this.indicatorLength;
        this.indicatorOffsetEnd   = this.indicatorMaxLength;

        this.bottomTextBottomOffset = 2 * Math.PI * this.indicatorRadius * ( ( 90 ) / 360 );
        this.bottomLength           = this.indicatorLength - ( this.indicatorOffsetStart - this.indicatorOffsetEnd );

        this.calculateSteps();
        this.calculateMarkers();
    }

    public ngAfterViewInit(): void {
        this.indicatorEl.nativeElement.style.strokeDashoffset = this.indicatorOffsetStart + 'px';

        setTimeout( () => {
            this.feValue = this.currentValue === undefined ? Math.min( this.feRange[ 0 ], this.feRange[ 1 ] ) : this.currentValue;
        } );

    }

    public degToRad( deg: number ): number {
        return deg * Math.PI / 180.0;
    }

    public calculateMarkers() {

        const width  = this.feDiameter / ( 450 / 10 );
        const height = this.feDiameter / ( 450 / 10 );

        const cx = ( this.canvasRadius + ( Math.cos( 90 * Math.PI / 180.0 ) * ( this.innerCircleRadius - ( this.innerFrameWidth / 2 ) - ( 450 / 17 ) ) ) ) - ( height / 2 );
        const y  = this.canvasRadius + ( Math.sin( 90 * Math.PI / 180.0 ) * ( this.innerCircleRadius - ( this.innerFrameWidth / 2 ) - ( 450 / 17 ) ) );

        const path = `M ${ width / 2 } ${ height } L 0 0 L ${ width } 0 Z`;

        for ( let markerValue of this.feMarkers ) {

            const min = Math.min( Math.min( this.feRange[ 0 ], this.feRange[ 1 ] ) );
            const max = Math.max( Math.max( this.feRange[ 0 ], this.feRange[ 1 ] ) );

            const p      = ( markerValue - min ) / ( max - min );
            const degree = ( p * ( 280 ) ) + 40;

            this.markers.push( { path: path, rotateDegree: degree, width: width, height: height, cx: cx, y: y } );
        }
    }

    public calculateSteps() {
        const min = Math.min( Math.min( this.feRange[ 0 ], this.feRange[ 1 ] ) );
        const max = Math.max( Math.max( this.feRange[ 0 ], this.feRange[ 1 ] ) );

        if ( ( this.feStepSize[ 0 ] <= 0 || this.feStepSize[ 0 ] > this.feRange[ 1 ] )
            && ( this.feStepSize[ 1 ] <= 0 || this.feStepSize[ 1 ] >= this.feStepSize[ 0 ] ) ) {
            return;
        }

        let stepCounter = 0;
        for ( let step = min; step < max; step += this.feStepSize[ 0 ] ) {

            const stepDegree = ( 280 / ( max - min ) ) * ( stepCounter * this.feStepSize[ 0 ] );

            const xOneStep = this.canvasRadius + ( Math.cos( this.degToRad( 130 + stepDegree ) ) * ( this.innerCircleRadius ) );
            const yOneStep = this.canvasRadius + ( Math.sin( this.degToRad( 130 + stepDegree ) ) * ( this.innerCircleRadius ) );
            const xTwoStep = this.canvasRadius + ( Math.cos( this.degToRad( 130 + stepDegree ) ) * ( this.innerCircleRadius - this.stepStrokeLength ) );
            const yTwoStep = this.canvasRadius + ( Math.sin( this.degToRad( 130 + stepDegree ) ) * ( this.innerCircleRadius - this.stepStrokeLength ) );

            for ( let interimStep = this.feStepSize[ 1 ]; interimStep < this.feStepSize[ 0 ]; interimStep += this.feStepSize[ 1 ] ) {

                const interimStepDegree = ( 280 / ( max - min ) ) * ( interimStep + ( stepCounter * this.feStepSize[ 0 ] ) );

                const xOneInterimStep = this.canvasRadius + ( Math.cos( this.degToRad( 130 + interimStepDegree ) ) * ( this.innerCircleRadius ) );
                const yOneInterimStep = this.canvasRadius + ( Math.sin( this.degToRad( 130 + interimStepDegree ) ) * ( this.innerCircleRadius ) );
                const xTwoInterimStep = this.canvasRadius + ( Math.cos( this.degToRad( 130 + interimStepDegree ) ) * ( this.innerCircleRadius - this.interimStepStrokeLength ) );
                const yTwoInterimStep = this.canvasRadius + ( Math.sin( this.degToRad( 130 + interimStepDegree ) ) * ( this.innerCircleRadius - this.interimStepStrokeLength ) );

                this.interimStepPaths.push( `M ${ xOneInterimStep } ${ yOneInterimStep } L ${ xTwoInterimStep } ${ yTwoInterimStep }` );
            }

            if ( step !== min ) {
                this.stepPaths.push( `M ${ xOneStep } ${ yOneStep } L ${ xTwoStep } ${ yTwoStep }` );

                const stepTextOffset = 2 * Math.PI * ( this.stepTextCircleRadius ) * ( ( 40 + stepDegree ) / 360 );

                this.stepTexts.push( { offset: stepTextOffset, text: step.toString() } );
            }

            stepCounter++;
        }
        console.log(this.stepTextCircleRadius)
    }

    public updateValue(): void {

        if ( this.currentValue === undefined ) {
            return;
        }

        const min = Math.min( Math.min( this.feRange[ 0 ], this.feRange[ 1 ] ), this.currentValue );
        const max = Math.max( Math.max( this.feRange[ 0 ], this.feRange[ 1 ] ), this.currentValue );

        this.animateNumber( this.currentValue );

        const p                          = ( this.currentValue - min ) / ( max - min );
        const w                          = this.indicatorOffsetStart + ( p * ( this.indicatorOffsetEnd - this.indicatorOffsetStart ) );
        this.indicatorMarkerRotateDegree = ( p * ( 280 ) ) + 40;

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

                this.foregroundValueEl.nativeElement.innerText = ( progress * ( countTo - start ) + start ).toFixed( this.feFractions );

                if ( progress < 1 ) {
                    window.requestAnimationFrame( step );
                }

            };

            window.requestAnimationFrame( step );
        } );
    }
}
