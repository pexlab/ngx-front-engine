import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component(
    {
        selector       : 'fe-markdown',
        template       : '<div class="rendered" [innerHTML]="parsedHTML"></div>',
        standalone     : true,
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles         : [
            ':host > .rendered { width: 100%; }'
        ]
    }
)
export class MarkdownComponent implements OnDestroy {

    public parsedHTML?: SafeHtml;

    private renderer = new marked.Renderer();

    private onDestroy$ = new Subject<void>();

    constructor(
        private hostElement: ElementRef<HTMLElement>,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        public change: ChangeDetectorRef
    ) {

        const prism = ( window as any ).Prism as typeof import('prismjs') | undefined;

        if ( prism !== undefined ) {
            this.renderer.code = ( code, language ) => {
                const lang            = language || 'markup';
                const highlightedCode = prism.highlight( code, prism.languages[ lang ] || prism.languages.markup, lang );
                return `<pre class="language-${ lang }"><code class="language-${ lang }">${ highlightedCode }</code></pre>`;
            };
        }

        marked.setOptions( {
            renderer: this.renderer
        } );
    }

    @Input()
    public set src( src: string | undefined ) {

        if ( !src ) {
            this.parsedHTML = undefined;
            this.change.detectChanges();
            return;
        }

        this.http.get( src, { responseType: 'text' } ).pipe(
            takeUntil( this.onDestroy$ )
        ).subscribe( {
            next: ( text: string ) => {
                this.parsedHTML = this.sanitizer.bypassSecurityTrustHtml(
                    marked.parse( text )
                );
                this.change.detectChanges();
            }
        } );
    }

    @Input()
    public set data( data: string | undefined ) {

        if ( !data ) {
            this.parsedHTML = undefined;
        } else {
            this.parsedHTML = this.sanitizer.bypassSecurityTrustHtml(
                marked.parse( data )
            );
        }

        this.change.detectChanges();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
