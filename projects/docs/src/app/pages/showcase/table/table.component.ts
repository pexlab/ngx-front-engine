import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TableColumn, TableDemoActions } from '@pexlab/ngx-front-engine';
import { Subscription } from 'rxjs';
import { EyeComponent } from './eye/eye.component';
import { SampleData } from './sample-data';

@Component(
    {
        templateUrl: './table.component.html',
        styleUrls  : [ './table.component.scss' ]
    }
)
export class TableComponent implements OnInit, OnDestroy {

    constructor( private fb: UntypedFormBuilder, public hostElement: ElementRef ) {
        this.formGroup = fb.group( {
            quicksearch: null
        } );
    }

    public ngOnInit(): void {
        this.formSubscription = this.formGroup.get( 'quicksearch' )?.valueChanges.subscribe( ( value ) => {
            this.quickSearch = value;
        } );
    }

    public ngOnDestroy(): void {
        this.formSubscription?.unsubscribe();
    }

    public quickSearch?: string;

    public formGroup!: UntypedFormGroup;
    public formSubscription?: Subscription;

    public tableActions = TableDemoActions;

    public tableColumns: TableColumn[] = [
        {
            linkedProperty: 'feInitialItemIndex',
            label         : {
                text: 'Item Index',
                icon: 'hashtag'
            }
        },
        {
            linkedProperty: 'name',
            label         : {
                text: 'Name',
                icon: 'user'
            }
        },
        {
            linkedProperty: 'company',
            label         : {
                text: 'Company',
                icon: 'building'
            }
        },
        {
            linkedProperty: 'eye.color',
            label         : {
                text: 'Eye Color',
                icon: 'eye'
            },
            renderer      : EyeComponent
        },
        {
            linkedProperty: 'address',
            label         : {
                text: 'Address',
                icon: 'location'
            },
            collapsible   : true
        }
    ];

    public sampleData: Promise<any[]> | any[] = new Promise<TableColumn[]>( ( resolve ) => {

            let data: any[] = SampleData;

            setTimeout( () => {
                resolve( data );
            }, 2000 );
        }
    );
}
