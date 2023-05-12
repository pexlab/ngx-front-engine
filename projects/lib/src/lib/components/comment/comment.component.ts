import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { z } from 'zod';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeTranslationTimeAgo } from '../../interfaces/i18n.interface';
import { ThemeableFeComponent } from '../../utils/component.utils';
import { FeTimeAgo } from '../../utils/time.utils';
import { FeBundledTranslations } from '../../utils/translation.utils';
import { IPartialCommentTheme } from './comment.theme';

@Component(
    {
        selector   : 'fe-comment',
        templateUrl: './comment.component.html',
        styleUrls  : [ './comment.component.scss' ]
    }
)
export class CommentComponent extends ThemeableFeComponent implements OnInit, OnDestroy {

    constructor(
        public hostElement: ElementRef,
        public change: ChangeDetectorRef
    ) {
        super();
        this.initializeFeComponent( 'comment', this );
    }

    /* ===== */

    @Input()
    public feTheme: ComponentTheme<IPartialCommentTheme> | undefined;

    @Input()
    public feAuthor!: ICommentAuthor;

    @Input()
    public feMessage!: ICommentMessage;

    /* TODO: add hover tooltip */
    @Input()
    public feButtons: ICommentButton[] = [];

    @Input()
    public feAppearance: 'spacious' | 'wrapped' | 'unwrapped' | 'auto' = 'spacious';

    @Input()
    public feTranslation: FeTranslationTimeAgo | 'auto' | 'auto_en' | 'auto_de' = 'auto';

    /* ===== */

    @ViewChild( 'username', { static: true } )
    private usernameEl!: ElementRef<HTMLElement>;

    @ViewChild( 'profilePicture', { static: true } )
    private profilePictureEl!: ElementRef<HTMLElement>;

    @ViewChild( 'previewWrapper', { static: true } )
    private previewWrapper!: ElementRef<HTMLElement>;

    /* ===== */

    private autoAppearance: 'spacious' | 'wrapped' | 'unwrapped' = 'spacious';

    private autoTranslation: FeTranslationTimeAgo = this.region === 'de' ? FeBundledTranslations.TimeAgo.German : FeBundledTranslations.TimeAgo.English;

    public get region(): 'en' | 'de' {
        switch ( this.feTranslation ) {
            case 'auto_de':
                return 'de';
            case 'auto_en':
                return 'en';
            default:
                return navigator.language.split( '-' )[ 0 ].toLowerCase() === 'de' ? 'de' : 'en';
        }
    }

    public get appearance(): 'spacious' | 'wrapped' | 'unwrapped' {
        return this.feAppearance === 'auto' ? this.autoAppearance : this.feAppearance;
    }

    public get translation(): FeTranslationTimeAgo {
        return typeof this.feTranslation === 'string' ? this.autoTranslation : this.feTranslation;
    }

    public readableDateString!: string;
    public dateString!: string;

    public showPreciseDate = false;

    private observer?: ResizeObserver;

    public ngOnInit(): void {

        this.readableDateString = FeTimeAgo(
            this.feMessage.editDate ? this.feMessage.editDate : this.feMessage.publishDate,
            this.translation
        );

        this.dateString = this.translation.precise( this.feMessage.editDate ? this.feMessage.editDate : this.feMessage.publishDate );

        this.observer = new ResizeObserver( entries => {

            const width = entries[ 0 ].contentRect.width;

            const newAppearance  = width >= 700 ? 'spacious' : width >= 500 ? 'wrapped' : 'unwrapped';
            const newTranslation = width <= 400 ?
                                   (
                                       this.region === 'de' ?
                                       FeBundledTranslations.TimeAgo.AbbreviatedGerman : FeBundledTranslations.TimeAgo.AbbreviatedEnglish
                                   ) :
                                   (
                                       this.region === 'de' ?
                                       FeBundledTranslations.TimeAgo.German : FeBundledTranslations.TimeAgo.English
                                   );

            if (
                this.autoAppearance !== newAppearance ||
                this.autoTranslation !== newTranslation
            ) {

                this.autoAppearance  = newAppearance;
                this.autoTranslation = newTranslation;

                this.readableDateString = FeTimeAgo(
                    this.feMessage.editDate ? this.feMessage.editDate : this.feMessage.publishDate,
                    this.translation
                );

                this.dateString = this.translation.precise( this.feMessage.editDate ? this.feMessage.editDate : this.feMessage.publishDate );

                this.change.detectChanges();
            }
        } );

        this.observer.observe( this.hostElement.nativeElement );
    }

    public ngOnDestroy(): void {
        this.observer?.unobserve( this.hostElement.nativeElement );
        this.observer?.disconnect();
    }

    public get badges(): string[] {
        switch ( typeof this.feAuthor.badge ) {
            case 'boolean':
                return this.feAuthor.badge ? [ 'fe-verified-badge' ] : [];
            case 'string':
                return [ this.feAuthor.badge ];
            case 'object':
                return this.feAuthor.badge;
        }
    }
}

export const ZCommentAuthor = z.object(
    {

        nickname: z.string().default( () => {
            return 'Anonymous User';
        } ),

        avatarUrl: z.string().default( () => {
            return 'assets/fe-images/unknown-avatar.svg';
        } ),

        badge: z.boolean().or( z.string() ).or( z.string().array() ).default( false ),

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
        markdown   : z.undefined(),
        publishDate: z.date(),
        editDate   : z.date().optional()
    }
).or(
    z.object( {
        text       : z.undefined(),
        markdown   : z.string(),
        publishDate: z.date(),
        editDate   : z.date().optional()
    } )
);

export type ICommentMessage = z.infer<typeof ZCommentMessage>;

export interface ICommentButton {
    icon: string,
    iconColor: string,
    overwriteIdleIconColor: boolean,
    backgroundColor: string,
    onClick: () => void
}
