import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'aadc-appbar',
    templateUrl: 'app/core/appbar/appbar.component.html'
})
export class AppbarComponent implements OnInit {

    /* Public properties */
    @Input() apptitle = '';
    @Input() subtitle = '';

    constructor() { }

    ngOnInit() { 

    }

}