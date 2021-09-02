import {
    Component,
    HostListener,
    Input,
    OnInit, Output,
    TemplateRef,
    ViewChild,
    EventEmitter
} from '@angular/core';

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
export class DropdownChoiceComponent implements OnInit {
    
    @Input()
    public feKey!: string;
    
    @Input()
    public feValue!: string;
    
    @Output()
    public feOnSelect = new EventEmitter<void>();
    
    @ViewChild( 'placeholderTemplateRef' )
    public placeholderRef!: TemplateRef<void>;
    
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
