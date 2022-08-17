import { AnimationEvent } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { AlertPortalAnimation } from './alert-portal.animation';
import { AlertPortalService } from './alert-portal.service';
import { PartialAlertPortalTheme } from './alert-portal.theme';

@FeComponent( 'alertPortal' )
@Component(
    {
        selector       : 'fe-alert-portal',
        templateUrl    : './alert-portal.component.html',
        styleUrls      : [ './alert-portal.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush,
        animations     : [ AlertPortalAnimation ]
    }
)
export class AlertPortalComponent implements OnInit {

    constructor(
        public hostElement: ElementRef,
        private alert: AlertPortalService,
        public change: ChangeDetectorRef
    ) { }

    @Input()
    public feTheme!: ComponentTheme<PartialAlertPortalTheme>;

    /* TODO: make changeable on the fly */
    @Input()
    public feInstance!: string;

    @Input()
    public feMargin?: [ string, string ];

    @Output()
    public feAnimationStart: EventEmitter<AnimationEvent> = new EventEmitter();

    @Output()
    public feAnimationDone: EventEmitter<AnimationEvent> = new EventEmitter();

    public alerts: TaggedAlert[] = [];

    private channelSubscription!: Subscription;

    public ngOnInit(): void {

        if ( !this.feInstance ) {
            throw new Error( 'No instance name was set on alert-portal' );
        }

        this.alerts = this.alert.getAll( this.feInstance );

        this.channelSubscription = this.alert.channel.subscribe( ( event ) => {

            if ( event.instanceName === this.feInstance ) {
                this.alerts = event.alerts;
                this.change.detectChanges();
            }
        } );
    }

    public ngAfterViewInit(): void {
        this.change.detach();
    }

    public ngOnDestroy(): void {
        this.channelSubscription.unsubscribe();
    }

    public onAnimationStart( event: AnimationEvent ) {
        this.feAnimationStart.emit( event );
    }

    public onAnimationDone( event: AnimationEvent ) {
        this.feAnimationDone.emit( event );
    }

    public identify( index: number, alert: TaggedAlert ) {
        return alert.id;
    }

    public isEmoji( value: string ) {
        return /\p{Emoji}/u.test( value );
    }

    public getIcon( alert: Alert ): string {
        return alert.icon || 'fe-' + alert.type;
    }
}

export type AlertType = 'generic' | 'info' | 'success' | 'warning' | 'error';

export type Alert = {
    type: AlertType;
    title: string;
    description?: string;
    code?: string;
    icon?: string;
};

export type TaggedAlert = Alert & { id: string, remove: () => void };
