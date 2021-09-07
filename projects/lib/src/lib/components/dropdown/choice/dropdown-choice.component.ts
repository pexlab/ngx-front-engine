import {
    Component,
    HostListener,
    Input,
    OnInit, Output,
    TemplateRef,
    ViewChild,
    EventEmitter
} from '@angular/core';
import { AsynchronouslyInitialisedComponent } from '../../../utils/component.utils';

@Component(
    {
        selector : 'fe-dropdown-choice',
        template : `
            <ng-template #placeholderTemplateRef>
                <ng-content select="[fePlaceholder]"></ng-content>
            </ng-template>

            <ng-template #contentTemplateRef>
                <ng-content select="[feContent]"></ng-content>
            </ng-template>

            <ng-container *ngTemplateOutlet="contentTemplateRef"></ng-container>`,
        styleUrls: [ './dropdown-choice.component.scss' ]
    }
)
export class DropdownChoiceComponent extends AsynchronouslyInitialisedComponent implements OnInit {
    
    @Input()
    public feKey!: string;
    
    @Input()
    public feValue!: string;
    
    @Output()
    public feOnSelect = new EventEmitter<void>();
    
    private hasBeenInitialised = false;
    private _placeholderRef!: TemplateRef<void>;
    
    @ViewChild( 'placeholderTemplateRef' )
    public set placeholderRef( value: TemplateRef<void> ) {
        
        this._placeholderRef = value;
        
        if ( !this.hasBeenInitialised ) {
            this.componentLoaded();
            this.hasBeenInitialised = true;
        }
    }
    
    public get placeholderRef(): TemplateRef<void> {
        return this._placeholderRef;
    }
    
    @HostListener( 'click' )
    public onSelect(): void {
        this.feOnSelect.emit();
    }
    
    public ngOnInit(): void {
        if ( !this.feValue ) {
            throw new Error( 'Value missing on dropdown choice' );
        }
    }
}
