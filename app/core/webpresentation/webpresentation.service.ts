import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class WebPresentation {
    /* Public properties */
    get Subtitle(): string {
        return this.subTitle;
    }  
    /* Private fields */
    private pageTitle = 'Azure AD B2C Sample';
    private subTitle = '';
    
    /* Ctor */
    constructor(private title: Title) { }

    /* Public methods */
    public setPageTitle(title: string) {
        this.pageTitle = title;
    }

    public changeTitle(subtitle: string) {
        this.subTitle = subtitle;
        this.title.setTitle(this.subTitle + ' | ' + this.pageTitle);
    }

}