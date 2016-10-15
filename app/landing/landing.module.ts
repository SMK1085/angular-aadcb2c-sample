import { NgModule } from '@angular/core';

import { LandingComponent } from './landing.component';
import { ModuleRouting } from './landing.routing';
import { WebPresentation } from '../core/webpresentation/webpresentation.service';

@NgModule({
    imports: [ ModuleRouting ],
    declarations: [ LandingComponent ]
})
export class LandingModule {
    private subtitle: string = 'Welcome';

    constructor(private wp: WebPresentation) {
        this.wp.changeTitle(this.subtitle);        
    }
}