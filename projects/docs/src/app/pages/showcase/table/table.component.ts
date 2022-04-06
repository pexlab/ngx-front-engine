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
            linkedProperty: 'test',
            label         : {
                text       : 'Anlagen-Nr.',
                icon       : 'help',
                collapsible: true
            }
        },
        {
            linkedProperty: 'test',
            label         : {
                text       : 'Wartungskunde',
                icon       : 'help',
                collapsible: true
            }
        },
        {
            linkedProperty: 'test',
            label         : {
                text       : 'Firma',
                icon       : 'help',
                collapsible: true
            }
        },
        {
            linkedProperty: 'test',
            label         : {
                text       : 'Ort',
                icon       : 'help',
                collapsible: true
            }
        },
        {
            linkedProperty: 'test',
            label         : {
                text       : 'Matchcode',
                icon       : 'help',
                collapsible: true
            }
        }
    ];

    public sampleData = [
        {
            test: 'test 123!'
        }
    ];
}
