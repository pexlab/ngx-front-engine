import { Component, OnInit } from '@angular/core';
import { Color, FeColorPalette, ICommentAuthor, ICommentMessage, ZCommentAuthor } from '@pexlab/ngx-front-engine';
import { subWeeks } from 'date-fns';

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

    public author: ICommentAuthor = ZCommentAuthor.parse(
        {
            nickname : 'John Doe',
            avatarUrl: 'assets/images/john-doe-avatar.png',
            verified : true
        }
    );

    public message: ICommentMessage = {
        text       : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
        publishDate: subWeeks( new Date(), 2 )
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
