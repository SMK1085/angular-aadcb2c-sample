import { Injectable } from '@angular/core';

@Injectable()
export class AadcConfig {
    clientId: string;
    domainName: string;
    redirectUrl: string;
    responseMode: string;
    scope: string;
    policies: any; 
    promptSignIn: string;
    localStoragePrefix: string;
    postLogoutUrl: string;
}