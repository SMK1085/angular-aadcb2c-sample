import { Injectable } from '@angular/core';

/* Data structures */
import { AadcConfig } from './aadc-config.model';

@Injectable()
export class AadcService {

    get Configuration(): AadcConfig {
        return this.serviceConfig;
    }

    private serviceConfig: AadcConfig;

    /* Ctor */
    constructor(config: AadcConfig) { 
        if(config) {
            // validate the provided config
            let regexClientID = /\b[A-F0-9]{8}(?:-[A-F0-9]{4}){3}-[A-F0-9]{12}\b/;
            if(regexClientID.test(config.clientId) === false) {
                throw new Error('The client ID "' + config.clientId +'" is not a valid GUID. Please correct your configuration.');
            }

            let regexDN: RegExp = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
            if(regexDN.test(config.domainName) === false) {
                throw new Error('The domain name "' + config.domainName +'" is not valid. Please correct your configuration.');
            }

            // set some defaults
            if(config.localStoragePrefix === null || config.localStoragePrefix.length < 1) {
                config.localStoragePrefix = 'aadcb2c';
            }

            if(config.promptSignIn === null || config.promptSignIn.length < 1) {
                config.promptSignIn = 'login';
            }

            if(config.responseMode === null || config.responseMode.length < 1) {
                config.responseMode = 'fragment';
            }

            this.serviceConfig = config;

        } else {
            throw new Error('You need to provide a configuration for the AadcService.');
        }
    }

}