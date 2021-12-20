import { Component, OnInit } from '@angular/core';
import { ICommentMessage, ICommentAuthor, ZCommentAuthor, FeColorPalette, Color } from '@pexlab/ngx-front-engine';
import * as dayjs from 'dayjs';

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
        publishDate: dayjs().subtract(2, 'week').toDate()
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
