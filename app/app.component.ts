import { Component, OnInit } from '@angular/core';

import { WebPresentation } from './core/webpresentation/webpresentation.service';

@Component({
    selector: 'aadc-app',
    styleUrls: ['app/app.component.css'],
    templateUrl: 'app/app.component.html'
})
export class AppComponent implements OnInit {
    /** public properties */
    get title(): string {
        return 'Sample App';
    }

    get Subtitle(): string {
        return this.wp.Subtitle;
    }

    constructor(private wp: WebPresentation) { }

    ngOnInit() {

    }

}