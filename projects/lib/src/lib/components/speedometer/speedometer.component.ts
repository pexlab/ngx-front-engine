import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { customAlphabet } from 'nanoid';
import { parsePath, roundCommands } from 'svg-round-corners';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeableFeComponent } from '../../utils/component.utils';
import { SVGUtil } from '../../utils/svg.utils';
import { PartialSpeedometerTheme } from './speedometer.theme';

@Component(
    {
        selector   : 'fe-speedometer',
        templateUrl: './speedometer.component.html',
        styleUrls  : [ './speedometer.component.scss' ]
    }
)
export class SpeedometerComponent extends ThemeableFeComponent implements AfterViewInit {

    constructor(
        public hostElement: ElementRef,
        public domSam: DomSanitizer,
        public ngZone: NgZone,
        public change: ChangeDetectorRef
    ) {
        super();
        this.initializeFeComponent( 'speedometer', this );
    }

    @Input()
    public feTheme: ComponentTheme<PartialSpeedometerTheme> | undefined;

    @Input()
    public set feRange( value: [ number, number ] ) {
        this.range = value;

        this.ngOnInit();
    }

    public range!: [ number, number ];

    @Input()
    public set feDiameter( value: number ) {
        this.diameter = value;

        this.ngOnInit();
    }

    public diameter!: number;

    @Input()
    public set feStepSize( value: [ number, number ] ) {
        this.stepSize = value;

        this.ngOnInit();
    }

    public stepSize!: [ number, number ];

    @Input()
    public set feMarkers( value: number[] ) {
        this.inputMarkers = value;

        this.ngOnInit();
    }

    public inputMarkers!: number[];

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

    @Input()
    public fePulsate = false;

    @ViewChild( 'foregroundText' )
    public foregroundValueEl!: ElementRef<HTMLSpanElement>;

    @ViewChild( 'indicator' )
    public indicatorEl!: ElementRef<SVGCircleElement>;

    @ViewChild( 'labelPrimary', { static: false } )
    public set labelPrimary( item: ElementRef<SVGTextPathElement> ) {
        if ( item !== undefined ) {
            this.primaryLabelTrueWidth = item.nativeElement.getBBox( { fill: true, stroke: true, markers: true, clipped: true } ).width;
            this.change.detectChanges();
        }
    }

    public primaryLabelTrueWidth = 0;

    public svgUtil = SVGUtil;

    /* SVG drawing ids (to encapsulate defs and not affect other instances of the speedometer) */
    private generateId           = customAlphabet( 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 24 );
    public indicatorGradientId   = this.generateId();
    public innerFrameGradientId  = this.generateId();
    public innerCircleGradientId = this.generateId();
    public circleId              = this.generateId();
    public primaryLabelId        = this.generateId();
    public primaryLabelId2       = this.generateId();

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
    public stepTextMargin!: number;
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

    public markers!: { rotateDegree: number, radius: number, cx: number, cy: number }[];

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

        this.canvasRadius = this.diameter / 2;

        this.innerCircleDiameter = this.diameter / 1.5; //1.5 Ratio between feDiameter and innerCircleDiameter
        this.innerCircleRadius   = this.innerCircleDiameter / 2;

        this.outerFrameWidth = this.diameter / ( 450 / 3 ); //90 Ratio between outerFrameWidth and indicatorMargin
        this.innerFrameWidth = this.diameter / ( 450 / 3 ); //225 Ratio between innerFrameWidth and indicatorMargin
        this.indicatorMargin = this.diameter / 30; //30 Ratio between canvasDiameter and indicatorMargin

        this.stepStrokeWidth         = this.diameter / ( 450 / 3 ); // (450 / 3) Ratio between default feDiameter and default stepStrokeWidth
        this.interimStepStrokeWidth  = this.diameter / ( 450 / 2 ); // (450 / 2) Ratio between default feDiameter and default interimStepStrokeWidth
        this.stepStrokeLength        = this.diameter / ( 450 / 15 ); // (450 / 15) Ratio between default feDiameter and default STEP_STROKE_LENGTH
        this.interimStepStrokeLength = this.diameter / ( 450 / 7.5 ); // (450 / 7.5) Ratio between default feDiameter and default INTERIM_STEP_STOKE_LENGTH
        this.stepTextMargin          = ( this.diameter / 40 );
        this.stepTextCircleRadius    = this.innerCircleRadius - this.stepStrokeLength - this.stepTextMargin;

        this.hudStrokeWidth = this.diameter / ( 450 / 3 ); // (450 / 3) Ratio between default feDiameter and default hudStrokeWidth

        this.indicatorStartDegree = 130;
        this.indicatorEndDegree   = 50;

        this.indicatorWidth     = this.canvasRadius - this.innerCircleRadius - this.outerFrameWidth - ( this.indicatorMargin * 2 );
        this.indicatorRadius    = this.innerCircleRadius + this.indicatorMargin + ( this.indicatorWidth / 2 );
        this.indicatorLength    = Math.PI * 2 * this.indicatorRadius;
        this.indicatorMaxLength = this.indicatorLength - ( this.indicatorLength / 360 * 280 );

        this.indicatorGap = ( ( this.canvasRadius - this.outerFrameWidth - this.indicatorWidth - this.innerCircleRadius ) / 2 );

        this.xAxis1Hud = ( this.canvasRadius - this.outerFrameWidth ) * Math.cos( this.degToRad( this.indicatorStartDegree ) ) + this.canvasRadius;
        this.yAxis1Hud = ( this.canvasRadius - this.outerFrameWidth ) * Math.sin( this.degToRad( this.indicatorStartDegree ) ) + this.canvasRadius;

        this.xAxis2Hud = ( this.innerCircleRadius - ( this.diameter / 9 ) ) * Math.cos( this.degToRad( this.indicatorStartDegree ) ) + this.canvasRadius;
        this.yAxis2Hud = ( this.innerCircleRadius - ( this.diameter / 9 ) ) * Math.sin( this.degToRad( this.indicatorStartDegree ) ) + this.canvasRadius;

        this.xAxis3Hud = ( this.innerCircleRadius - ( this.diameter / 9 ) ) * Math.cos( this.degToRad( this.indicatorEndDegree ) ) + this.canvasRadius;
        this.yAxis3Hud = ( this.innerCircleRadius - ( this.diameter / 9 ) ) * Math.sin( this.degToRad( this.indicatorEndDegree ) ) + this.canvasRadius;

        this.xAxis4Hud = ( this.canvasRadius - this.outerFrameWidth ) * Math.cos( this.degToRad( this.indicatorEndDegree ) ) + this.canvasRadius;
        this.yAxis4Hud = ( this.canvasRadius - this.outerFrameWidth ) * Math.sin( this.degToRad( this.indicatorEndDegree ) ) + this.canvasRadius;

        this.hudPath = roundCommands( parsePath( `M${ this.xAxis1Hud } ${ this.yAxis1Hud }
    L ${ this.xAxis2Hud } ${ this.yAxis2Hud }
    L ${ this.xAxis3Hud } ${ this.yAxis3Hud }
    L ${ this.xAxis4Hud } ${ this.yAxis4Hud }` ), this.diameter / 9, 2 ).path;

        this.stepPaths        = [];
        this.interimStepPaths = [];

        this.stepTexts = [];

        this.indicatorMarkerRotateDegree = 40;
        this.indicatorMarkerWidth        = this.diameter / 22.5;
        this.indicatorMarkerHeight       = this.diameter / 22.5;
        this.indicatorMarkerCX           = this.canvasRadius + ( Math.cos( 90 * Math.PI / 180.0 ) * ( this.innerCircleRadius - ( this.innerFrameWidth + this.stepStrokeLength + ( this.diameter / 16 ) ) ) ) - ( this.indicatorMarkerWidth / 2 );
        this.indicatorMarkerY            = this.canvasRadius + ( Math.sin( 90 * Math.PI / 180.0 ) * ( this.innerCircleRadius - ( this.innerFrameWidth + this.stepStrokeLength + ( this.diameter / 16 ) ) ) );

        this.indicatorMarkerPath = `M ${ this.indicatorMarkerWidth / 2 } ${ this.indicatorMarkerHeight } L 0 0 L ${ this.indicatorMarkerWidth / 2 } ${ this.indicatorMarkerHeight / 3 } L ${ this.indicatorMarkerWidth } 0 Z`;

        this.markers = [];

        this.indicatorOffsetStart = this.indicatorLength;
        this.indicatorOffsetEnd   = this.indicatorMaxLength;

        this.bottomTextBottomOffset = 2 * Math.PI * this.indicatorRadius * ( ( 90 ) / 360 );
        this.bottomLength           = this.indicatorLength - ( this.indicatorOffsetStart - this.indicatorOffsetEnd );

        this.calculateSteps();
        this.calculateMarkers();
        this.updateValue();
    }

    public ngAfterViewInit(): void {

        this.indicatorEl.nativeElement.style.strokeDashoffset = this.indicatorOffsetStart + 'px';

        setTimeout( () => {
            this.feValue = this.currentValue === undefined ? Math.min( this.range[ 0 ], this.range[ 1 ] ) : this.currentValue;
        } );
    }

    public degToRad( deg: number ): number {
        return deg * Math.PI / 180.0;
    }

    public calculateMarkers() {

        if ( this.currentValue === undefined || this.range[ 0 ] === undefined || this.range[ 1 ] === undefined ) {
            return;
        }

        const radius = ( this.diameter / ( 380 ) ) * 2;

        const cx = ( this.canvasRadius + ( Math.cos( 90 * Math.PI / 180.0 ) * ( this.innerCircleRadius - ( this.innerFrameWidth + this.stepStrokeLength + ( this.diameter / 19 ) ) ) ) ) - ( radius / 2 );
        const cy = this.canvasRadius + ( Math.sin( 90 * Math.PI / 180.0 ) * ( this.innerCircleRadius - ( this.innerFrameWidth + this.stepStrokeLength + ( this.diameter / 19 ) ) ) );

        for ( let markerValue of this.inputMarkers ) {

            const min = Math.min( Math.min( this.range[ 0 ], this.range[ 1 ] ) );
            const max = Math.max( Math.max( this.range[ 0 ], this.range[ 1 ] ) );

            const p      = ( markerValue - min ) / ( max - min );
            const degree = ( p * ( 280 ) ) + 40;

            this.markers.push( { rotateDegree: degree, radius, cx, cy } );
        }
    }

    public calculateSteps() {

        if ( this.currentValue === undefined || this.range[ 0 ] === undefined || this.range[ 1 ] === undefined ) {
            return;
        }

        const min = Math.min( Math.min( this.range[ 0 ], this.range[ 1 ] ) );
        const max = Math.max( Math.max( this.range[ 0 ], this.range[ 1 ] ) );

        if ( ( this.stepSize[ 0 ] <= 0 || this.stepSize[ 0 ] > this.range[ 1 ] )
            && ( this.stepSize[ 1 ] <= 0 || this.stepSize[ 1 ] >= this.stepSize[ 0 ] ) ) {
            return;
        }

        let stepCounter = 0;
        for ( let step = min; step < max; step += this.stepSize[ 0 ] ) {

            const stepDegree = ( 280 / ( max - min ) ) * ( stepCounter * this.stepSize[ 0 ] );

            const xOneStep = this.canvasRadius + ( Math.cos( this.degToRad( 130 + stepDegree ) ) * ( this.innerCircleRadius - this.innerFrameWidth ) );
            const yOneStep = this.canvasRadius + ( Math.sin( this.degToRad( 130 + stepDegree ) ) * ( this.innerCircleRadius - this.innerFrameWidth ) );
            const xTwoStep = this.canvasRadius + ( Math.cos( this.degToRad( 130 + stepDegree ) ) * ( this.innerCircleRadius - this.innerFrameWidth - this.stepStrokeLength ) );
            const yTwoStep = this.canvasRadius + ( Math.sin( this.degToRad( 130 + stepDegree ) ) * ( this.innerCircleRadius - this.innerFrameWidth - this.stepStrokeLength ) );

            for ( let interimStep = this.stepSize[ 1 ]; interimStep < this.stepSize[ 0 ]; interimStep += this.stepSize[ 1 ] ) {

                const interimStepDegree = ( 280 / ( max - min ) ) * ( interimStep + ( stepCounter * this.stepSize[ 0 ] ) );

                if ( interimStepDegree < 280 ) {

                    const xOneInterimStep = this.canvasRadius + ( Math.cos( this.degToRad( 130 + interimStepDegree ) ) * ( this.innerCircleRadius - this.innerFrameWidth ) );
                    const yOneInterimStep = this.canvasRadius + ( Math.sin( this.degToRad( 130 + interimStepDegree ) ) * ( this.innerCircleRadius - this.innerFrameWidth ) );
                    const xTwoInterimStep = this.canvasRadius + ( Math.cos( this.degToRad( 130 + interimStepDegree ) ) * ( this.innerCircleRadius - this.innerFrameWidth - this.interimStepStrokeLength ) );
                    const yTwoInterimStep = this.canvasRadius + ( Math.sin( this.degToRad( 130 + interimStepDegree ) ) * ( this.innerCircleRadius - this.innerFrameWidth - this.interimStepStrokeLength ) );

                    this.interimStepPaths.push( `M ${ xOneInterimStep } ${ yOneInterimStep } L ${ xTwoInterimStep } ${ yTwoInterimStep }` );
                }
            }

            if ( step !== min ) {
                this.stepPaths.push( `M ${ xOneStep } ${ yOneStep } L ${ xTwoStep } ${ yTwoStep }` );

                const stepTextOffset = 2 * Math.PI * ( this.stepTextCircleRadius ) * ( ( 40 + stepDegree ) / 360 );

                this.stepTexts.push( { offset: stepTextOffset, text: step.toString() } );
            }

            stepCounter++;
        }
    }

    public updateValue(): void {

        if ( this.currentValue === undefined || this.range[ 0 ] === undefined || this.range[ 1 ] === undefined || this.indicatorEl === undefined ) {
            return;
        }

        const min = Math.min( Math.min( this.range[ 0 ], this.range[ 1 ] ), this.currentValue );
        const max = Math.max( Math.max( this.range[ 0 ], this.range[ 1 ] ), this.currentValue );

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

    public trackByIndex( index: number, item: any ) {
        return index;
    };
}
