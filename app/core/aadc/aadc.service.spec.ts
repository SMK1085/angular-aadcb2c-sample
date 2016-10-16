import { AadcService } from './aadc.service';
import { AadcConfig } from './aadc-config.model';

describe('AadcService without Testbed', () => {

    let service: AadcService;

    it('throws an error when no configuration is provided in the constructor', () => {
        expect(() => { service = new AadcService(null); }).toThrowError('You need to provide a configuration for the AadcService.');
    });

    it('throws an error when the clientId provided is not a  GUID', () => {
        let config: AadcConfig = {
            clientId: 'foo',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access'
        };

        expect(() => { service = new AadcService(config); }).toThrowError('The client ID "' + config.clientId + '" is not a valid GUID. Please correct your configuration.');
    });

    it('throws an error when the domainName provided is not valid domain', () => {
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access'
        };

        expect(() => { service = new AadcService(config); }).toThrowError('The domain name "' + config.domainName + '" is not valid. Please correct your configuration.');
    });

    it('sets the localStoragePrefix to aadcb2c if null is provided', () => {
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: null,
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access'
        };

        service = new AadcService(config);
        expect(config.localStoragePrefix).toBe('aadcb2c');
    });

    it('sets the localStoragePrefix to aadcb2c if an empty string is provided', () => {
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: '',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access'
        };

        service = new AadcService(config);
        expect(config.localStoragePrefix).toBe('aadcb2c');
    });

    it('sets the promptSignIn to login if null is provided', () => {
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: null,
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access'
        };

        service = new AadcService(config);
        expect(config.promptSignIn).toBe('login');
    });

    it('sets the promptSignIn to login if an empty string is provided', () => {
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: '',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access'
        };

        service = new AadcService(config);
        expect(config.promptSignIn).toBe('login');
    });

    it('sets the responseMode to fragment if null is provided', () => {
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: null,
            scope: 'openid offline_access'
        };

        service = new AadcService(config);
        expect(config.responseMode).toBe('fragment');
    });

    it('sets the responseMode to fragment if an empty string is provided', () => {
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: '',
            scope: 'openid offline_access'
        };

        service = new AadcService(config);
        expect(config.responseMode).toBe('fragment');
    });


});