import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

/* Feature Modules */
import { CoreModule }     from './core/core.module';
import { LandingModule } from './landing/landing.module';

/* Routing */
import { AppRouting }        from './app.routing';

@NgModule({
    imports: [ BrowserModule, CoreModule, LandingModule, AppRouting ],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }