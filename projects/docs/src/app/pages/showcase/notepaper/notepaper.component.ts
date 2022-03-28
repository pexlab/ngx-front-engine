import { Component, OnInit } from '@angular/core';

@Component(
    {
        templateUrl: './notepaper.component.html',
        styleUrls  : [ './notepaper.component.scss' ]
    }
)
export class NotepaperComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    public exampleNotes = [
        'Welcome!',
        'With this component you currently can:',
        '',
        '- list things down',
        '- **highlight important stuff**',
        '---',
        '- add a divider'
    ];

    public exampleNotes2 = 'You can also put everything in one string\n\nThis respects the common newline characters:\r-\\r\n-\\n';
}
