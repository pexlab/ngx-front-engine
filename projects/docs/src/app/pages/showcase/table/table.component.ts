import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ComponentTheme, feTrackRow, PartialTableTheme, TableColumn, TableDemoActions } from '@pexlab/ngx-front-engine';
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

    public items                  = [
        {
            feRowId: '1',
            name   : 'Short'
        },
        {
            feRowId: '2',
            name   : 'Some longer text'
        },
        {
            feRowId: '3',
            name   : 'A very long text that will break the line and make a larger height'
        },
        {
            feRowId: '4',
            name   : 'Short again'
        },
        {
            feRowId: '5',
            name   : 'a'
        },
        {
            feRowId: '6',
            name   : 'A veeeeeeeeeeery long line luuuuuul what happened here?'
        },
        {
            feRowId: '7',
            name   : 'Short again'
        },
        {
            feRowId: '8',
            name   : 'bbb'
        },
        {
            feRowId: '9',
            name   : 'A nice long line... what happened here?'
        },
        {
            feRowId: '10',
            name   : 'Short again!!'
        },
        {
            feRowId: '11',
            name   : 'cccawd'
        },
        {
            feRowId: '12',
            name   : 'Short'
        },
        {
            feRowId: '13',
            name   : 'Some longer text'
        },
        {
            feRowId: '14',
            name   : 'A very long text that will break the line and make a larger height'
        },
        {
            feRowId: '15',
            name   : 'Short again'
        },
        {
            feRowId: '16',
            name   : 'a'
        },
        {
            feRowId: '17',
            name   : 'A veeeeeeeeeeery long line luuuuuul what happened here?'
        },
        {
            feRowId: '18',
            name   : 'Short again'
        },
        {
            feRowId: '19',
            name   : 'bbb'
        },
        {
            feRowId: '20',
            name   : 'A nice long line... what happened here?'
        },
        {
            feRowId: '21',
            name   : 'Short again!!'
        },
        {
            feRowId: '22',
            name   : 'cccawd'
        }
    ];
    protected readonly feTrackRow = feTrackRow;
}
