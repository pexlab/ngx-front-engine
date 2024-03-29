import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeableFeComponent } from '../../utils/component.utils';
import { PartialNotepaperTheme } from './notepaper.theme';

@Component(
    {
        selector   : 'fe-notepaper',
        templateUrl: './notepaper.component.html',
        styleUrls  : [ './notepaper.component.scss' ]
    }
)
export class NotepaperComponent extends ThemeableFeComponent {

    constructor( public hostElement: ElementRef ) {
        super();
        this.initializeFeComponent( 'notepaper', this );
    }

    private internalNotes!: TextLine[];

    @Input()
    public feTheme: ComponentTheme<PartialNotepaperTheme> | undefined;

    @Input()
    public feHeading!: string;

    @Input()
    public set feNotes( input: string | string[] ) {

        if ( !input ) {
            this.internalNotes = [];
            return;
        }

        if ( Array.isArray( input ) ) {

            this.internalNotes = input.map( ( text ) => {
                return this.inferInput( text );
            } );

        } else {

            const lines = input.split( '\r' ).join( '\n' ).trim().split( '\n' );

            let result: string[] = [];

            lines.forEach( ( line ) => {
                if ( line ) {
                    result.push( line );
                }
            } );

            this.internalNotes = result.map( ( text ) => {
                return this.inferInput( text );
            } );

            if ( this.internalNotes[ 0 ] ) {

                if ( this.internalNotes[ 0 ]?.divider ) {

                    if ( this.internalNotes[ 1 ] ) {
                        this.internalNotes = this.internalNotes.slice( 1 );
                    } else {
                        this.internalNotes = [];
                    }

                }

                if ( this.internalNotes[ this.internalNotes.length - 1 ]?.divider ) {
                    this.internalNotes = this.internalNotes.slice( 0, this.internalNotes.length - 1 );
                }
            }
        }
    }

    public get inferredNotes(): TextLine[] {
        return this.internalNotes;
    }

    @Input()
    public feButtonText?: string;

    @Output()
    public feButtonClick: EventEmitter<any> = new EventEmitter();

    private inferInput( input: string ): TextLine {

        const divider   = input?.match( /^---+$/ )?.length === 1 ?? false;
        const important = ( input.replace( /^- ?/, '' ).match( /^\*\*.*\*\*$/ )?.length ?? 0 ) > 0;
        const listItem  = input.startsWith( '-' );
        const stripped  = input.replace( /^- ?/, '' ).replace( /^\*\*/, '' ).replace( /\*\*$/, '' );

        return {
            divider,
            important,
            listItem,
            stripped
        };
    }
}

type TextLine = {
    divider: boolean,
    important: boolean,
    listItem: boolean,
    stripped: string
}
