import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { z } from 'zod';
import { ComponentTheme, ZHEXColor } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { AlertPortalAnimation } from './alert-portal.animation';
import { AlertPortalService } from './alert-portal.service';

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
        private cdr: ChangeDetectorRef
    ) { }
    
    @Input()
    public feTheme!: ComponentTheme<PartialAlertPortalTheme>;
    
    /* TODO: make changeable on the fly */
    @Input()
    public feInstance!: string;
    
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
                this.cdr.detectChanges();
            }
        } );
    }
    
    public ngAfterViewInit(): void {
        this.cdr.detach();
    }
    
    public ngOnDestroy(): void {
        this.channelSubscription.unsubscribe();
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

export const ZAlertTheme = z.object(
    {
        
        title      : ZHEXColor,
        description: ZHEXColor,
        background : ZHEXColor,
        
        icon          : ZHEXColor,
        iconBackground: ZHEXColor,
        
        codeBorder    : ZHEXColor,
        codeBackground: ZHEXColor
    }
);

export const ZAlertPortalTheme = z.object(
    {
        generic: ZAlertTheme,
        info   : ZAlertTheme,
        success: ZAlertTheme,
        warning: ZAlertTheme,
        error  : ZAlertTheme
    }
);

export const ZPartialAlertPortalTheme = ZAlertPortalTheme.partial();

export type AlertPortalTheme = z.infer<typeof ZAlertPortalTheme>;
export type PartialAlertPortalTheme = z.infer<typeof ZPartialAlertPortalTheme>;