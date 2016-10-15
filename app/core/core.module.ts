import { ModuleWithProviders, NgModule,
    Optional, SkipSelf }       from '@angular/core';

import { CommonModule }      from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppbarComponent }    from './appbar/appbar.component';

import { WebPresentation } from './webpresentation/webpresentation.service';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [AppbarComponent],
    exports: [AppbarComponent],
    providers: [WebPresentation]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }

    // static forRoot(config: AadcConfig): ModuleWithProviders {
    //     return {
    //         ngModule: CoreModule,
    //         providers: [
    //             { provide: AadcConfig, useValue: config },
    //             JwtUtilService
    //         ]
    //     };
    // }
}