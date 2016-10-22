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
    constructor(config: AadcConfig, private logger?: AadcLogger) {
        if (config) {
            // validate the provided config
            let regexClientID = /\b[A-F0-9]{8}(?:-[A-F0-9]{4}){3}-[A-F0-9]{12}\b/;
            if (regexClientID.test(config.clientId) === false) {
                throw new Error('The client ID "' + config.clientId + '" is not a valid GUID. Please correct your configuration.');
            }

            let regexDN: RegExp = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
            if (regexDN.test(config.domainName) === false) {
                throw new Error('The domain name "' + config.domainName + '" is not valid. Please correct your configuration.');
            }

            if (config.policies !== null && !config.policies.signin) {
                throw new Error("The policies member must have a property signin with the default signin policy name assigned.");
            }

            // set some defaults
            if (config.localStoragePrefix === null || config.localStoragePrefix.length < 1) {
                config.localStoragePrefix = 'aadcb2c';
            }

            if (config.promptSignIn === null || config.promptSignIn.length < 1) {
                config.promptSignIn = 'login';
            }

            if (config.responseMode === null || config.responseMode.length < 1) {
                config.responseMode = 'fragment';
            }

            this.serviceConfig = config;

        } else {
            throw new Error('You need to provide a configuration for the AadcService.');
        }
    }

    /* Public methods */
    public login(policy?: string) {
        let p: string = policy ? policy : this.serviceConfig.policies.signin;
        let nonce: string = this.generateGuid();
        let state: string = this.generateGuid();
        let baseUrl: string = window.location.protocol + '//' + window.location.host;

        // persist the state and nonce in local storage
        this.setNonce(nonce);
        this.setState(state);

        let url: string = this.getLoginUrl(baseUrl, nonce, state, p);

        // Log verbose information before executing the redirect to Azure AD server
        if (this.logger && this.logger.logLevel === 'verbose') {
            this.logger.logInfo('AADC Login: Redirecting to "' + url + '".');
        }

        window.location.assign(url);
    }

    public getLoginUrl(baseUrl: string, nonce: string, state: string, p: string): string {
        let url: string = 'https://login.microsoftonline.com/' + this.serviceConfig.domainName +
            '/oauth2/v2.0/authorize?client_id=' + this.serviceConfig.clientId +
            '&response_type=' + this.serviceConfig.responseMode +
            '&redirect_uri=' + encodeURIComponent(baseUrl + this.serviceConfig.redirectUrl) +
            '&response_mode=' + this.serviceConfig.responseMode +
            '&scope=' + this.serviceConfig.scope +
            '&state=' + encodeURIComponent(state) +
            '&nonce=' + nonce +
            '&p=' + p;

        return url;
    }

    public handleLoginCallback() {

    }

    public logout(policy?: string) {
        let p: string = policy ? policy : this.serviceConfig.policies.signin;
        let url: string = this.getLogoutUrl(this.serviceConfig.postLogoutUrl, p);

        // Log verbose information before executing the redirect to Azure AD server
        if (this.logger && this.logger.logLevel === 'verbose') {
            this.logger.logInfo('AADC Login: Redirecting to "' + url + '".');
        }

        window.location.assign(url);
    }

    public getLogoutUrl(redirectUrl: string, p: string): string {
        let url: string = 'https://login.microsoftonline.com/' + this.serviceConfig.domainName +
            '/oauth2/v2.0/logout?p=' + p +
            '&post_logout_redirect_uri=' + encodeURIComponent(redirectUrl);
        return url;
    }

    public editProfile(policy?: string) {
        let p: string = policy ? policy : (this.serviceConfig.policies.editProfile ? this.serviceConfig.policies.editProfile : null);
        // Verify that there is a policy for editing profile present or throw an error
        if (p === null) {
            let errMsg: string = 'No policy specified for editing a user profile. Specify a policy either directly or under policies.editProfile in the AadcConfig.';
            if (this.logger) {
                let errNoPolicy: Error = new Error(errMsg);
                this.logger.logError(errNoPolicy);
            }
            throw new Error(errMsg);
        }

        let nonce: string = this.generateGuid();
        let state: string = window.location.pathname; // store the current url in the state to redirect properly
        let baseUrl: string = window.location.protocol + '//' + window.location.host;

        // persist the state and nonce in local storage
        this.setNonce(nonce);
        this.setState(state);

        let url: string = this.getEditProfileUrl(baseUrl, nonce, state, p);

        // Log verbose information before executing the redirect to Azure AD server
        if (this.logger && this.logger.logLevel === 'verbose') {
            this.logger.logInfo('AADC Edit Profile: Redirecting to "' + url + '".');
        }

        window.location.assign(url);
    }

    public getEditProfileUrl(baseUrl: string, nonce: string, state: string, p: string) {
        let url: string = 'https://login.microsoftonline.com/' + this.serviceConfig.domainName +
            '/oauth2/v2.0/authorize?client_id=' + this.serviceConfig.clientId +
            '&response_type=' + this.serviceConfig.responseMode +
            '&redirect_uri=' + encodeURIComponent(baseUrl + this.serviceConfig.redirectUrl) +
            '&response_mode=' + this.serviceConfig.responseMode +
            '&scope=' + this.serviceConfig.scope +
            '&state=' + encodeURIComponent(state) +
            '&nonce=' + nonce +
            '&p=' + p;

        return url;
    }

    public clearCache() {
        this.setNonce('');
        this.setState('');
        this.setRedirectLocal('');
    }

    /* Private methods */
    private setNonce(value: string) {
        localStorage.setItem(this.serviceConfig.localStoragePrefix + '-nonce', value);
    }

    private getNonce(): string {
        return localStorage.getItem(this.serviceConfig.localStoragePrefix + '-nonce');
    }

    private setState(value: string) {
        localStorage.setItem(this.serviceConfig.localStoragePrefix + '-state', value);
    }

    private getState(): string {
        return localStorage.getItem(this.serviceConfig.localStoragePrefix + '-state');
    }

    private setRedirectLocal(value: string) {
        localStorage.setItem(this.serviceConfig.localStoragePrefix + '-redir', value);
    }

    private getRedirectLocal(): string {
        return localStorage.getItem(this.serviceConfig.localStoragePrefix + '-redir');
    }

    private generateGuid(): string {
        // The following code is a typescript port of the adal.js library
        // that can be found on GitHub: https://github.com/AzureAD/azure-activedirectory-library-for-js

        // RFC4122: The version 4 UUID is meant for generating UUIDs from truly-random or
        // pseudo-random numbers.
        // The algorithm is as follows:
        //     Set the two most significant bits (bits 6 and 7) of the
        //        clock_seq_hi_and_reserved to zero and one, respectively.
        //     Set the four most significant bits (bits 12 through 15) of the
        //        time_hi_and_version field to the 4-bit version number from
        //        Section 4.1.3. Version4
        //     Set all the other bits to randomly (or pseudo-randomly) chosen
        //     values.
        // UUID                   = time-low "-" time-mid "-"time-high-and-version "-"clock-seq-reserved and low(2hexOctet)"-" node
        // time-low               = 4hexOctet
        // time-mid               = 2hexOctet
        // time-high-and-version  = 2hexOctet
        // clock-seq-and-reserved = hexOctet:
        // clock-seq-low          = hexOctet
        // node                   = 6hexOctet
        // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        // y could be 1000, 1001, 1010, 1011 since most significant two bits needs to be 10
        // y values are 8, 9, A, B
        let cryptoObj: Crypto = window.crypto || (window as any).msCrypto;
        if (cryptoObj && cryptoObj.getRandomValues) {
            let buffer: Uint8Array = new Uint8Array(16);
            cryptoObj.getRandomValues(buffer);
            //buffer[6] and buffer[7] represents the time_hi_and_version field. We will set the four most significant bits (4 through 7) of buffer[6] to represent decimal number 4 (UUID version number).
            buffer[6] |= 0x40; //buffer[6] | 01000000 will set the 6 bit to 1.
            buffer[6] &= 0x4f; //buffer[6] & 01001111 will set the 4, 5, and 7 bit to 0 such that bits 4-7 == 0100 = "4".
            //buffer[8] represents the clock_seq_hi_and_reserved field. We will set the two most significant bits (6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively.
            buffer[8] |= 0x80; //buffer[8] | 10000000 will set the 7 bit to 1.
            buffer[8] &= 0xbf; //buffer[8] & 10111111 will set the 6 bit to 0.

            return this.decimalToHex(buffer[0]) +
                this.decimalToHex(buffer[1]) +
                this.decimalToHex(buffer[2]) +
                this.decimalToHex(buffer[3]) +
                '-' +
                this.decimalToHex(buffer[4]) +
                this.decimalToHex(buffer[5]) +
                '-' +
                this.decimalToHex(buffer[6]) +
                this.decimalToHex(buffer[7]) +
                '-' +
                this.decimalToHex(buffer[8]) +
                this.decimalToHex(buffer[9]) +
                '-' +
                this.decimalToHex(buffer[10]) +
                this.decimalToHex(buffer[11]) +
                this.decimalToHex(buffer[12]) +
                this.decimalToHex(buffer[13]) +
                '-' +
                this.decimalToHex(buffer[14]) +
                this.decimalToHex(buffer[15]);


        } else {
            let guidHolder: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
            let hex: string = '0123456789abcdef';
            let r: number = 0;
            let guidResponse: string = "";
            for (var i = 0; i < 36; i++) {
                if (guidHolder[i] !== '-' && guidHolder[i] !== '4') {
                    // each x and y needs to be random
                    r = Math.random() * 16 | 0;
                }
                if (guidHolder[i] === 'x') {
                    guidResponse += hex[r];
                } else if (guidHolder[i] === 'y') {
                    // clock-seq-and-reserved first hex is filtered and remaining hex values are random
                    r &= 0x3; // bit and with 0011 to set pos 2 to zero ?0??
                    r |= 0x8; // set pos 3 to 1 as 1???
                    guidResponse += hex[r];
                } else {
                    guidResponse += guidHolder[i];
                }
            }
            return guidResponse;

        }
    }

    private decimalToHex(num: number) {
        // The following code is a typescript port of the adal.js library
        // that can be found on GitHub: https://github.com/AzureAD/azure-activedirectory-library-for-js

        let hex: string = num.toString(16);
        while (hex.length < 2) {
            hex = '0' + hex;
        }
        return hex;
    }
}


export interface AadcLogger {

    logLevel: string;

    logInfo(message: string);
    logWarning(message: string);
    logError(err: Error);
}