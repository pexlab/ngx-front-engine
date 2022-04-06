import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { z } from 'zod';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { PartialButtonTheme } from '../button/button.theme';
import { PartialTableTheme } from './table.theme';

@FeComponent( 'table' )
@Component(
    {
        selector       : 'fe-table',
        templateUrl    : './table.component.html',
        styleUrls      : [ './table.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class TableComponent implements OnInit {

    constructor( public hostElement: ElementRef ) { }

    @Input()
    public feTheme!: ComponentTheme<PartialTableTheme>;

    @Input()
    public feColumns!: TableColumn[];

    @Input()
    public feData!: any[] | Promise<any[]>;

    @Input()
    public feReorderable = false;

    @Input()
    public feCollapse?: boolean;

    @Input()
    public feFocusOnData = false;

    @Input()
    public feMode: 'paginated' | 'infinite' = 'paginated';

    public ngOnInit(): void {
    }

    public inactiveButtonTheme: ComponentTheme<PartialButtonTheme> = {
        palette: {
            background: '#808080'
        }
    };
}

const ZTableColumnLabel = z.union(
    [
        z.object(
            {
                icon       : z.string(),
                text       : z.string(),
                collapsible: z.boolean().default( false ).optional()
            }
        ),
        z.object(
            {
                icon       : z.undefined(),
                text       : z.string(),
                collapsible: z.undefined()
            }
        )
    ]
);

const ZTableColumnSort = z.object(
    {
        canBeOverwritten: z.boolean().default( true ),
        initial         : z.object(
            {
                direction       : z.enum( [ 'asc', 'desc', 'none' ] ).default( 'none' ),
                overwritesMemory: z.boolean().default( false ),
                overwritesOrder : z.boolean().default( false )
            }
        )
    }
).default(
    {
        canBeOverwritten: true,
        initial         : {
            direction       : 'none',
            overwritesMemory: false,
            overwritesOrder : false
        }
    }
).optional();

export const ZTableColumn = z.object(
    {
        linkedProperty: z.string(),
        label         : ZTableColumnLabel,
        sort          : ZTableColumnSort,
        renderer      : z.string().optional()
    }
);

export type TableColumn = z.infer<typeof ZTableColumn>;
