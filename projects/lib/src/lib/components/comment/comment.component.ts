import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { z } from 'zod';
import { ComponentTheme, ZHEXColor } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { FeTimeAgo } from '../../utils/time.utils';
import { FeBundledTranslations } from '../../utils/translation.utils';
import { PartialButtonTheme } from '../button/button.component';

@FeComponent( 'comment' )
@Component(
    {
        selector   : 'fe-comment',
        templateUrl: './comment.component.html',
        styleUrls  : [ './comment.component.scss' ]
    }
)
export class CommentComponent implements OnInit {
    
    constructor( public hostElement: ElementRef ) { }
    
    @Input()
    public feTheme!: ComponentTheme<PartialButtonTheme>;
    
    @Input()
    public feAuthor!: ICommentAuthor;
    
    /* TODO: add more content types other than just text */
    @Input()
    public feMessage!: ICommentMessage;
    
    /* TODO: add hover tooltip */
    @Input()
    public feButtons: ICommentButton[] = [];
    
    @Input()
    public feAppearance: 'spacious' | 'wrapped' | 'unwrapped' = 'spacious';
    
    @ViewChild( 'username', { static: true } )
    private usernameEl!: ElementRef<HTMLElement>;
    
    @ViewChild( 'profilePicture', { static: true } )
    private profilePictureEl!: ElementRef<HTMLElement>;
    
    @ViewChild( 'previewWrapper', { static: true } )
    private previewWrapper!: ElementRef<HTMLElement>;
    
    public readableDateString!: string;
    
    public ngOnInit(): void {
        this.readableDateString = FeTimeAgo(
            this.feMessage.editDate ? this.feMessage.editDate : this.feMessage.publishDate,
            FeBundledTranslations.TimeAgo.English
        );
    }
}

export const ZCommentTheme = z.object(
    {
        text         : ZHEXColor,
        date         : ZHEXColor,
        iconIdle     : ZHEXColor,
        verifiedBadge: ZHEXColor,
        border       : ZHEXColor,
        background   : ZHEXColor
    }
);

export const ZPartialCommentTheme = ZCommentTheme.partial();

export type ICommentTheme = z.infer<typeof ZCommentTheme>;
export type IPartialCommentTheme = z.infer<typeof ZPartialCommentTheme>;

export const ZCommentAuthor = z.object(
    {
        
        nickname: z.string().default( () => {
            return 'Anonymous User';
        } ),
        
        avatarUrl: z.string().default( () => {
            return 'assets/fe-images/unknown-avatar.svg';
        } ),
        
        verified: z.boolean().default( false ),
        
        onPreview: z.function().default( () => {
            return () => {
                /* TODO: open a profile view */
            };
        } ),
        
        onVisit: z.function().default( () => {
            return () => {};
        } )
    }
);

export type ICommentAuthor = z.infer<typeof ZCommentAuthor>;

export const ZCommentMessage = z.object(
    {
        text       : z.string(),
        publishDate: z.date(),
        editDate   : z.date().optional()
    }
);

export type ICommentMessage = z.infer<typeof ZCommentMessage>;

export interface ICommentButton {
    icon: string,
    iconColor: string,
    overwriteIdleIconColor: boolean,
    backgroundColor: string,
    onClick: () => void
}