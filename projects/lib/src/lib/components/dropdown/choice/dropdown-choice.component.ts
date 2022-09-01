import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AsynchronouslyInitialisedComponent } from '../../../utils/component.utils';

@Component(
    {
        selector       : 'fe-dropdown-choice',
        template       : `
            <ng-template #placeholderTemplateRef>
                <ng-content select="[fePlaceholder]"></ng-content>
            </ng-template>

            <ng-template #contentTemplateRef>
                <ng-content select="[feContent]"></ng-content>
            </ng-template>

            <div class="wrapper" tabindex="0" [fe-tactile]="animate" (feClick)="feOnSelect.emit()">
                <div class="inner" #animate>
                    <ng-container *ngTemplateOutlet="contentAndPlaceholderRef || contentTemplateRef"></ng-container>
                </div>
            </div>`,
        styleUrls      : [ './dropdown-choice.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class DropdownChoiceComponent extends AsynchronouslyInitialisedComponent implements OnInit {

    constructor(
        public hostElement: ElementRef<HTMLElement>
    ) {
        super();
    }

    @ContentChild( TemplateRef )
    public contentAndPlaceholderRef!: TemplateRef<void>;

    @Input()
    public feKey!: string;

    @Input()
    public feValue!: string;

    @Output()
    public feOnSelect = new EventEmitter<void>();

    private hasBeenInitialised = false;
    private _placeholderRef!: TemplateRef<void>;
    private _contentRef!: TemplateRef<void>;

    @ViewChild( 'placeholderTemplateRef' )
    public set placeholderRef( value: TemplateRef<void> ) {

        this._placeholderRef = value;

        if ( !this.hasBeenInitialised ) {
            this.componentLoaded();
            this.hasBeenInitialised = true;
        }
    }

    @ViewChild( 'contentTemplateRef' )
    public set contentRef( value: TemplateRef<void> ) {

        this._contentRef = value;

        if ( !this.hasBeenInitialised ) {
            this.componentLoaded();
            this.hasBeenInitialised = true;
        }
    }

    public get placeholderRef(): TemplateRef<void> {
        return this._placeholderRef;
    }

    public get contentRef(): TemplateRef<void> {
        return this._contentRef;
    }

    public ngOnInit(): void {
        if ( !this.feValue ) {
            throw new Error( 'Value missing on dropdown choice' );
        }
    }
}
