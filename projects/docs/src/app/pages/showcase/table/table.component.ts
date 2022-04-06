import { Component, OnInit } from '@angular/core';
import { TableColumn } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './table.component.html',
        styleUrls  : [ './table.component.scss' ]
    }
)
export class TableComponent implements OnInit {

    constructor() { }

    public ngOnInit(): void {
    }

    public tableColumns: TableColumn[] = [
        {
            linkedProperty: 'a',
            label         : {
                text       : 'Property A',
                icon       : 'help',
                collapsible: true
            }
        },
        {
            linkedProperty: 'b',
            label         : {
                text       : 'Property B',
                icon       : 'help',
                collapsible: true
            }
        },
        {
            linkedProperty: 'c',
            label         : {
                text       : 'Property C',
                icon       : 'help',
                collapsible: true
            }
        },
        {
            linkedProperty: 'd',
            label         : {
                text       : 'Property d',
                icon       : 'help',
                collapsible: true
            }
        },
        {
            linkedProperty: 'e',
            label         : {
                text       : 'Property E',
                icon       : 'help',
                collapsible: true
            }
        }
    ];

    public sampleData = [
        {
            a: 'Test A',
            b: 'Test B',
            c: 'Test C',
            d: 'Test D',
            e: 'Test E'
        }
    ];
}
