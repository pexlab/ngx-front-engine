import { Component, OnInit } from '@angular/core';
import { Color, FeColorPalette, ICommentAuthor, ICommentMessage, ZCommentAuthor } from '@pexlab/ngx-front-engine';
import { subDays, subHours, subWeeks } from 'date-fns';

@Component(
    {
        templateUrl: './comment.component.html',
        styleUrls  : [ './comment.component.scss' ]
    }
)
export class CommentComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    private comment = 'Let\'s try some **Markdown**:\n' +
        '\n' +
        '# Hello, everybody!\n' +
        '\n' +
        'This is a comment component. In here you can `format` your text.\n' +
        '\n' +
        '> Like this quote.\n' +
        '>\n' +
        '>\n' +
        '> > Or this quote inside a quote.\n' +
        '>\n' +
        '> \\- John Doe, February 2023\n' +
        '\n' +
        '```typescript\n' +
        '/* Or this code-block */\n' +
        'console.log( \'Power to the user!\' );\n' +
        '```\n';

    public author: ICommentAuthor = ZCommentAuthor.parse(
        {
            nickname : 'John Doe',
            avatarUrl: 'assets/images/john-doe-avatar.png',
            badge    : true
        }
    );

    public message: ICommentMessage = {
        markdown   : this.comment,
        publishDate: subHours( subDays( subWeeks( new Date(), 2 ), 3 ), 12 )
    };

    public buttons = [
        {
            icon                  : 'heart',
            iconColor             : FeColorPalette.Red.Coral,
            overwriteIdleIconColor: false,
            backgroundColor       : Color.fadeHex( FeColorPalette.Red.Coral, 0.15 ),
            onClick               : function() {
                this.overwriteIdleIconColor = !this.overwriteIdleIconColor;
            }
        },
        {
            icon                  : 'comment',
            iconColor             : FeColorPalette.Blue.Azure,
            overwriteIdleIconColor: false,
            backgroundColor       : Color.fadeHex( FeColorPalette.Blue.Azure, 0.15 ),
            onClick               : () => {}
        },
        {
            icon                  : 'repost',
            iconColor             : FeColorPalette.Green.Salem,
            overwriteIdleIconColor: false,
            backgroundColor       : Color.fadeHex( FeColorPalette.Green.Salem, 0.15 ),
            onClick               : function() {
                this.overwriteIdleIconColor = !this.overwriteIdleIconColor;
            }
        }
    ];
}
