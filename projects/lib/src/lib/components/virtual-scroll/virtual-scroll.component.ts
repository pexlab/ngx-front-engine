import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { NeuralNetwork } from 'brain.js';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeService } from '../../theme/theme.service';
import { FeComponent } from '../../utils/component.utils';
import { PartialVirtualScrollTheme } from './virtual-scroll.theme';

type VirtualScrollRow = {
    [ key: string ]: any,
    feRowId: string
};

@FeComponent( 'virtualScroll' )
@Component(
    {
        selector       : 'fe-virtual-scroll',
        templateUrl    : './virtual-scroll.component.html',
        styleUrls      : [ './virtual-scroll.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class VirtualScrollComponent implements AfterViewInit, OnChanges, AfterViewChecked, OnDestroy {

    constructor(
        public hostElement: ElementRef<HTMLElement>,
        public change: ChangeDetectorRef,
        private renderer: Renderer2,
        private ngZone: NgZone,
        private theme: ThemeService
    ) {
    }

    /* Outputs */

    @Output() feOnRender = new EventEmitter<[ number, number ]>();

    /* Inputs */

    @Input() feTheme!: ComponentTheme<PartialVirtualScrollTheme>;

    @Input() feRows!: VirtualScrollRow[];

    @Input() feBuffer: number = 0;

    @Input() feRowHeightMeasurementTrigger: 'render' | 'observer' | EventEmitter<HTMLElement[] | void> = 'observer';

    @Input() feRowHeightPredictor: 'frequent' | 'average' | 'ai' | ( () => number ) = 'ai';

    @Input() feRowHeightAiTransformer: ( rows: VirtualScrollRow[] ) => Map<string, number[]> = ( rows ) => {

        if ( rows.length === 0 ) {
            return new Map<string, number[]>();
        }

        const resultMap      = new Map<string, number[]>();
        const keyIndexMap    = new Map<string, number>();
        let freeIndex        = 0;
        let inlineTableIndex = 0;

        for ( const row of rows ) {
            resultMap.set(
                row.feRowId,
                Object.entries( row ).reduce( ( result, [ key, value ] ) => {

                    if ( key === 'feRowId' ) {
                        return result;
                    }

                    const keyIndex = ( () => {
                        if ( keyIndexMap.has( key ) ) {
                            return keyIndexMap.get( key )!;
                        } else {
                            keyIndexMap.set( key, freeIndex );
                            return freeIndex++;
                        }
                    } )();

                    if ( key === 'feInlineTable' ) {

                        result[ keyIndex ] = 1111;
                        inlineTableIndex   = keyIndex;

                    } else if ( typeof value === 'string' ) {

                        result[ keyIndex ] = value.length;

                    } else {

                        result[ keyIndex ] = 0;
                    }

                    return result;

                }, [] as number[] )
            );
        }

        resultMap.forEach( ( value, key ) => {
            for ( let i = 0; i < freeIndex; i++ ) {
                if ( value[ i ] === undefined ) {
                    if ( i === inlineTableIndex ) {
                        value[ i ] = -1111;
                    } else {
                        value[ i ] = -1;
                    }
                }
            }
            resultMap.set( key, value );
        } );

        return resultMap;
    };

    /* View and Content Children */

    @ViewChild( 'scrollHeight' ) scrollHeightRef!: ElementRef<HTMLDivElement>;

    @ViewChild( 'contentWrapper' ) contentWrapperRef!: ElementRef<HTMLDivElement>;

    @ContentChildren( 'feRow', { read: ElementRef } ) nativeRenderedRows!: QueryList<ElementRef>;

    /* Variables */

    private resolveViewCheckedArray: ( () => void )[] = [];

    private waitForRendering(): Promise<void> {
        return new Promise( ( resolve ) => {
            this.resolveViewCheckedArray.push( resolve );
        } );
    }

    public feRowsToRender: BehaviorSubject<VirtualScrollRow[]> = new BehaviorSubject<VirtualScrollRow[]>( [] );

    private rowHeightObserver = new ResizeObserver( ( affectedRows ) => {
        this.measureRowHeight( affectedRows.map( row => row.target as HTMLElement ) );
    } );

    private rowHeightCache = new Map<string, number>();

    private rowHeightPredictionCache = new Map<string, number>();

    private rowHeightPredictor?: NeuralNetwork<number[], { height: number }>;

    private rowHeightTransformerCache = new Map<string, number[]>();

    private initialRender = true;

    private onDestroy$ = new Subject<void>();

    /* Lifecycle methods */

    public ngAfterViewInit(): void {

        this.ngZone.runOutsideAngular( () => {

            if ( typeof this.feRowHeightMeasurementTrigger !== 'string' ) {

                this.feRowHeightMeasurementTrigger.pipe(
                    takeUntil( this.onDestroy$ )
                ).subscribe( {
                    next: ( event ) => {

                        const rows = event ? event : this.nativeRenderedRows.map( row => row.nativeElement );

                        this.measureRowHeight( rows, false );
                        this.updateActiveRenderedRows();
                    }
                } );

            } else if ( this.feRowHeightMeasurementTrigger === 'render' ) {

                this.feOnRender.pipe(
                    takeUntil( this.onDestroy$ )
                ).subscribe( {
                    next: () => {
                        this.measureRowHeight( this.nativeRenderedRows.map( row => row.nativeElement ) );
                    }
                } );

            } else {

                this.manageHeightObservers();

                this.nativeRenderedRows.changes.pipe(
                    takeUntil( this.onDestroy$ )
                ).subscribe( {
                    next: () => {
                        this.manageHeightObservers();
                    }
                } );
            }

            fromEvent( this.hostElement.nativeElement, 'scroll' ).pipe(
                takeUntil( this.onDestroy$ ),
                auditTime( 100 )
            ).subscribe( {
                next: () => {
                    this.updateActiveRenderedRows();
                }
            } );

            this.updateActiveRenderedRows();
        } );
    }

    public ngOnChanges( changes: SimpleChanges ): void {
        if ( changes.feRows ) {

            if ( this.nativeRenderedRows === undefined ) {
                return;
            }

            this.resetCache();
            this.updateActiveRenderedRows();
        }
    }

    public ngAfterViewChecked() {

        while ( this.resolveViewCheckedArray.length ) {

            const resolve = this.resolveViewCheckedArray.shift();

            if ( resolve ) {
                resolve();
            }
        }
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    /* Logic */

    public updatable = true;

    public updateActiveRenderedRows(): void {

        if ( !this.updatable ) {
            return;
        }

        const visibleData = this.getVisible();

        const start = visibleData.start;
        const end   = visibleData.end;

        const currentRowsToRender = this.feRowsToRender.value;
        const newRowsToRender     = visibleData.rows;

        if ( !this.compareRows( currentRowsToRender, newRowsToRender ) ) {

            this.ngZone.run( () => {

                const update = () => {

                    this.marginTop = visibleData.marginTop;

                    this.feRowsToRender.next( newRowsToRender );

                    this.waitForRendering().then( () => {
                        this.feOnRender.next( [ start, end ] );
                    } );

                    this.change.detectChanges();
                };

                if ( this.initialRender ) {
                    Promise.resolve( null ).then( () => update() );
                } else {
                    update();
                }
            } );
        }
    }

    private getVisible(): { start: number; end: number; marginTop: number, rows: VirtualScrollRow[] } {

        const scrollTop      = this.hostElement.nativeElement.scrollTop;
        const viewportHeight = this.hostElement.nativeElement.clientHeight;

        let yOffset   = 0;
        let marginTop = 0;

        let startIndex = -1;
        let endIndex   = -1;

        let allHeightsZero = true;

        for ( let i = 0; i < this.feRows.length; i++ ) {

            const rowId  = this.feRows[ i ].feRowId;
            const height = this.rowHeightCache.get( rowId ) ?? this.rowHeightPredictionCache.get( rowId ) ?? 0;

            if ( height !== 0 ) {
                allHeightsZero = false;
            }

            if ( yOffset + height >= scrollTop && startIndex === -1 ) {
                startIndex = i;
                marginTop  = yOffset;
            }

            if ( yOffset + height >= scrollTop + viewportHeight && endIndex === -1 ) {
                endIndex = i;
            }

            yOffset += height;
        }

        if ( endIndex === -1 ) {
            endIndex = this.feRows.length - 1;
        }

        if ( allHeightsZero ) {
            endIndex = Math.min( 4, this.feRows.length - 1 );
        }

        /* Get buffer indices before */
        let bufferIndicesBefore = 0;
        let bufferHeightBefore  = 0;
        for ( let i = Math.max( 0, startIndex - this.feBuffer ); i < startIndex; i++ ) {
            const rowId  = this.feRows[ i ].feRowId;
            const height = this.rowHeightCache.get( rowId ) ?? this.rowHeightPredictionCache.get( rowId ) ?? 0;
            bufferHeightBefore += height;
            bufferIndicesBefore++;
        }

        /* Adjust marginTop for the buffer */
        marginTop = Math.max( 0, marginTop - bufferHeightBefore );

        /* Get the rows to render */
        const start = Math.max( 0, startIndex - bufferIndicesBefore );
        const end   = Math.min( this.feRows.length, endIndex + this.feBuffer );
        const rows  = this.feRows.slice( start, end + 1 );

        return { start: startIndex, end: endIndex, marginTop: marginTop, rows: rows };
    }

    /* Helpers */

    public resetCache(): void {
        this.rowHeightCache.clear();
        this.rowHeightPredictionCache.clear();
        this.rowHeightTransformerCache.clear();
        this.rowHeightTransformerCache = this.feRowHeightAiTransformer( this.feRows );
    }

    private trainAi(): void {

        const trainingData: { input: number[], output: { height: number } }[] = [];

        const normalizeHeight = this.heightNormalizeFactor;

        this.rowHeightCache.forEach( ( height, id ) => {

            const transformed = this.rowHeightTransformerCache.get( id );

            if ( transformed ) {
                trainingData.push( {
                    input : transformed,
                    output: {
                        height: height / normalizeHeight
                    }
                } );
            }
        } );

        this.rowHeightPredictor = new NeuralNetwork<number[], { height: number }>();

        if ( trainingData.length > 0 ) {
            this.rowHeightPredictor.train( trainingData, {
                iterations: trainingData.length * 2
            } );
        }
    }

    private measureRowHeight( rows: HTMLElement[], trigger = true ): void {

        const changedHeight = new Map<string, number>();

        for ( const row of rows ) {

            const id = row.dataset.feRowId;

            if ( !id ) {
                throw new Error( 'Row doesn\'t contain its id in its dataset' );
            }

            const newHeight = row.offsetHeight;

            if ( this.rowHeightCache.get( id ) !== newHeight ) {
                this.rowHeightCache.set( id, newHeight );
                changedHeight.set( id, newHeight );
            }
        }

        if ( changedHeight.size > 0 ) {

            if ( this.feRowHeightPredictor === 'ai' ) {
                this.trainAi();
            }

            this.updateScrollHeight( trigger );
        }
    }

    private compareRows( row1: VirtualScrollRow[], row2: VirtualScrollRow[] ): boolean {

        if ( row1.length !== row2.length ) {
            return false;
        }

        for ( let i = 0; i < row1.length; i++ ) {
            if ( row1[ i ].feRowId !== row2[ i ].feRowId ) {
                return false;
            }
        }

        return true;
    }

    private set marginTop( value: number ) {
        this.renderer.setStyle( this.contentWrapperRef.nativeElement, 'transform', `translateY(${ value }px)` );
    }

    private get heightNormalizeFactor() {
        return Array.from(
            this.rowHeightCache.values()
        ).reduce(
            ( currentMax, height ) => height > currentMax ? height : currentMax, 0
        );
    }

    private get knownRowHeightSum(): number {
        return Array.from(
            this.rowHeightCache.values()
        ).reduce( ( currentSum, height ) => currentSum + height, 0 );
    }

    private manageHeightObservers() {

        this.rowHeightObserver.disconnect();

        this.nativeRenderedRows.forEach( ( row ) => {
            this.rowHeightObserver.observe( row.nativeElement );
        } );
    }

    private updateScrollHeight( trigger = true ): void {

        this.renderer.setStyle(
            this.scrollHeightRef.nativeElement,
            'transform',
            `scaleY(${ this.predictRowHeightSum() })`
        );

        this.change.detectChanges();

        if ( trigger ) {
            this.updateActiveRenderedRows();
        }
    }

    private predictRowHeightSum(): number {
        switch ( this.feRowHeightPredictor ) {
            case 'frequent':
                return this.getFrequentRowHeightSum();
            case 'average':
                return this.getAverageRowHeightSum();
            case 'ai':
                return this.getAiRowHeightSum();
            default:
                return this.feRowHeightPredictor();
        }
    }

    /* Different row height prediction techniques */

    private getFrequentRowHeightSum(): number {

        if ( this.rowHeightCache.size === 0 ) {
            return 0;
        }

        const occurrenceCounter = new Map<number, number>();

        Array.from(
            this.rowHeightCache.values()
        ).forEach( ( value ) => {
            if ( occurrenceCounter.has( value ) ) {
                occurrenceCounter.set( value, occurrenceCounter.get( value )! + 1 );
            } else {
                occurrenceCounter.set( value, 1 );
            }
        } );

        const mostOccurring = Array.from(
            occurrenceCounter.entries()
        ).reduce( ( mostOccurring, check ) =>
            check[ 1 ] > mostOccurring[ 1 ] ? check : mostOccurring
        )[ 0 ];

        this.rowHeightPredictionCache.clear();

        this.feRows.forEach( ( row ) => {
            this.rowHeightPredictionCache.set( row.feRowId, mostOccurring );
        } );

        return this.knownRowHeightSum + ( mostOccurring * ( this.feRows.length - this.rowHeightCache.size ) );
    }

    private getAverageRowHeightSum(): number {

        if ( this.rowHeightCache.size === 0 ) {
            return 0;
        }

        const average = Array.from(
            this.rowHeightCache.values()
        ).reduce( ( sum, value ) => sum + value, 0 ) / this.rowHeightCache.size;

        this.rowHeightPredictionCache.clear();

        this.feRows.forEach( ( row ) => {
            this.rowHeightPredictionCache.set( row.feRowId, average );
        } );

        return this.knownRowHeightSum + ( average * ( this.feRows.length - this.rowHeightCache.size ) );
    }

    private getAiRowHeightSum(): number {

        if ( this.rowHeightTransformerCache.size === 0 ) {
            return 0;
        }

        if ( !this.rowHeightPredictor || !this.rowHeightPredictor.isRunnable ) {
            return 0;
        }

        let accumulatedHeightPredictions = 0;

        const normalizeHeight = this.heightNormalizeFactor;

        this.rowHeightPredictionCache.clear();

        for ( const [ rowId, transformedRow ] of this.rowHeightTransformerCache ) {

            if ( this.rowHeightCache.has( rowId ) ) {
                this.rowHeightPredictionCache.set( rowId, this.rowHeightCache.get( rowId )! );
                continue;
            }

            const prediction           = this.rowHeightPredictor.run( transformedRow );
            const predictionNormalized = +( prediction.height * normalizeHeight ).toFixed( 1 );

            this.rowHeightPredictionCache.set( rowId, predictionNormalized );

            accumulatedHeightPredictions += predictionNormalized;
        }

        return this.knownRowHeightSum + accumulatedHeightPredictions;
    }
}

export function feTrackRow( index: number, row: VirtualScrollRow ): string {
    return row.feRowId;
}
