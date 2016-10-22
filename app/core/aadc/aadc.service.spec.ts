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
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
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
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
        };

        expect(() => { service = new AadcService(config); }).toThrowError('The domain name "' + config.domainName + '" is not valid. Please correct your configuration.');
    });

    it('throws an error when the policies have no member called signin', () => {
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                foo: 'foo'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
        };

        expect(() => { service = new AadcService(config); }).toThrowError("The policies member must have a property signin with the default signin policy name assigned.");
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
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
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
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
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
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
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
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
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
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
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
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
        };

        service = new AadcService(config);
        expect(config.responseMode).toBe('fragment');
    });

    it('composes the proper url for login', () => {

        let baseUrl: string = 'https://localhost:443';
        let state: string = 'state';
        let nonce: string = 'nonce';
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
        };

        let url: string = 'https://login.microsoftonline.com/' + config.domainName +
            '/oauth2/v2.0/authorize?client_id=' + config.clientId +
            '&response_type=' + config.responseMode +
            '&redirect_uri=' + encodeURIComponent(baseUrl + config.redirectUrl) +
            '&response_mode=' + config.responseMode +
            '&scope=' + config.scope +
            '&state=' + encodeURIComponent(state) +
            '&nonce=' + nonce +
            '&p=' + config.policies.signin;

        
        service = new AadcService(config);
        expect(service.getLoginUrl(baseUrl, nonce, state, config.policies.signin)).toBe(url);

    });

    it('composes the proper url for logout', () => {
        let redirectUrl = 'http://test.io';
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
        };

        let url: string = 'https://login.microsoftonline.com/' + config.domainName +
                            '/oauth2/v2.0/logout?p=' + config.policies.signin +
                            '&post_logout_redirect_uri=' + encodeURIComponent(redirectUrl);

        service = new AadcService(config);
        expect(service.getLogoutUrl(redirectUrl, config.policies.signin)).toBe(url);
    });

    it('throws an error when no editprofile policy is present', () => {
        let baseUrl: string = 'https://localhost:443';
        let state: string = 'state';
        let nonce: string = 'nonce';
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
        };

        let url: string = 'https://login.microsoftonline.com/' + config.domainName +
            '/oauth2/v2.0/authorize?client_id=' + config.clientId +
            '&response_type=' + config.responseMode +
            '&redirect_uri=' + encodeURIComponent(baseUrl + config.redirectUrl) +
            '&response_mode=' + config.responseMode +
            '&scope=' + config.scope +
            '&state=' + encodeURIComponent(state) +
            '&nonce=' + nonce +
            '&p=' + config.policies.signin;

        
        service = new AadcService(config);
        expect(() => { service.editProfile(null); }).toThrowError('No policy specified for editing a user profile. Specify a policy either directly or under policies.editProfile in the AadcConfig.');
    });

    it('composes the proper url for edit profile', () => {

        let baseUrl: string = 'https://localhost:443';
        let state: string = 'state';
        let nonce: string = 'nonce';
        let config: AadcConfig = {
            clientId: '00000000-0000-0000-0000-000000000000',
            domainName: 'testb2c.onmicrosoft.com',
            localStoragePrefix: 'testb2c',
            policies: {
                signin: 'B2C_1_SignIn1',
                editProfile: 'B2C_1_EditProfile1'
            },
            promptSignIn: 'login',
            redirectUrl: '/auth/signin',
            responseMode: 'fragment',
            scope: 'openid offline_access',
            postLogoutUrl: 'http://test.io'
        };

        let url: string = 'https://login.microsoftonline.com/' + config.domainName +
            '/oauth2/v2.0/authorize?client_id=' + config.clientId +
            '&response_type=' + config.responseMode +
            '&redirect_uri=' + encodeURIComponent(baseUrl + config.redirectUrl) +
            '&response_mode=' + config.responseMode +
            '&scope=' + config.scope +
            '&state=' + encodeURIComponent(state) +
            '&nonce=' + nonce +
            '&p=' + config.policies.editProfile;

        
        service = new AadcService(config);
        expect(service.getLoginUrl(baseUrl, nonce, state, config.policies.editProfile)).toBe(url);

    });

});
