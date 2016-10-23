import { async, TestBed } from '@angular/core/testing';
import { AadcService } from './aadc.service';
import { AadcConfig, AadcLogger } from './aadc-config.model';
import { JwtUtilService } from './aadc-jwtutil.service';
import { Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('AadcService without Testbed', () => {

    let service: AadcService;

    it('throws an error when no configuration is provided in the constructor', () => {
        let jwt: JwtUtilService = new JwtUtilService(null);

        expect(() => { service = new AadcService(null, jwt); }).toThrowError('You need to provide a configuration for the AadcService.');
    });

    it('throws an error when no jwtutil is passed into the constructor', () => {
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        expect(() => { service = new AadcService(config, null); }).toThrowError('No JWTUtilService injected. Check object passed as jwtUtil.');
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let jwt: JwtUtilService = new JwtUtilService(null);

        expect(() => { service = new AadcService(config, jwt); }).toThrowError('The client ID "' + config.clientId + '" is not a valid GUID. Please correct your configuration.');
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let jwt: JwtUtilService = new JwtUtilService(null);

        expect(() => { service = new AadcService(config, jwt); }).toThrowError('The domain name "' + config.domainName + '" is not valid. Please correct your configuration.');
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let jwt: JwtUtilService = new JwtUtilService(null);

        expect(() => { service = new AadcService(config, jwt); }).toThrowError("The policies member must have a property signin with the default signin policy name assigned.");
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
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
            postLogoutUrl: 'http://test.io',
            logger: null
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

        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
        expect(service.getLoginUrl(baseUrl, nonce, state, config.policies.signin)).toBe(url);

    });

    it('composes the proper url for login with prompt', () => {

        let baseUrl: string = 'https://localhost:443';
        let state: string = 'state';
        let nonce: string = 'nonce';
        let prompt: string = 'login';
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let url: string = 'https://login.microsoftonline.com/' + config.domainName +
            '/oauth2/v2.0/authorize?client_id=' + config.clientId +
            '&response_type=' + config.responseMode +
            '&redirect_uri=' + encodeURIComponent(baseUrl + config.redirectUrl) +
            '&response_mode=' + config.responseMode +
            '&scope=' + config.scope +
            '&state=' + encodeURIComponent(state) +
            '&nonce=' + nonce +
            '&p=' + config.policies.signin +
            '&prompt=' + prompt;

        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
        expect(service.getLoginUrl(baseUrl, nonce, state, config.policies.signin, prompt)).toBe(url);

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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let url: string = 'https://login.microsoftonline.com/' + config.domainName +
            '/oauth2/v2.0/logout?p=' + config.policies.signin +
            '&post_logout_redirect_uri=' + encodeURIComponent(redirectUrl);

        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
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
            postLogoutUrl: 'http://test.io',
            logger: null
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


        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
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
            postLogoutUrl: 'http://test.io',
            logger: null
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


        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
        expect(service.getLoginUrl(baseUrl, nonce, state, config.policies.editProfile)).toBe(url);

    });

    it('composes the proper url for edit profile with prompt', () => {

        let baseUrl: string = 'https://localhost:443';
        let state: string = 'state';
        let nonce: string = 'nonce';
        let prompt: string = 'login';
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
            postLogoutUrl: 'http://test.io',
            logger: null
        };

        let url: string = 'https://login.microsoftonline.com/' + config.domainName +
            '/oauth2/v2.0/authorize?client_id=' + config.clientId +
            '&response_type=' + config.responseMode +
            '&redirect_uri=' + encodeURIComponent(baseUrl + config.redirectUrl) +
            '&response_mode=' + config.responseMode +
            '&scope=' + config.scope +
            '&state=' + encodeURIComponent(state) +
            '&nonce=' + nonce +
            '&p=' + config.policies.editProfile +
            '&prompt=' + prompt;


        let jwt: JwtUtilService = new JwtUtilService(null);

        service = new AadcService(config, jwt);
        expect(service.getLoginUrl(baseUrl, nonce, state, config.policies.editProfile, prompt)).toBe(url);

    });


    it('logs an info message when the hash passed does not have an id_token property present', () => {
        let logger = new LoggerFake('verbose');
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
            postLogoutUrl: 'http://test.io',
            logger: logger
        };

        let jwt: JwtUtilService = new JwtUtilService(null);
        

        let hashFragment = 'x=foo';

        service = new AadcService(config, jwt);
        service.handleLoginCallbackFragment(hashFragment);

        expect(logger.infoMsg).toBe('The parsed repsonse does not contain an id_token; not a login request.');
    });

    it('logs an info message with the parsed response properties when the hash represents a valid AD response', () => {
        let logger = new LoggerFake('verbose');
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
            postLogoutUrl: 'http://test.io',
            logger: logger
        };

        let jwt: JwtUtilService = new JwtUtilService(null);
        

        let hashFragment = 'id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq&state=arbitrary_data';
        let expectedMsg = 'The parsed repsonse contains the following parameters: {"id_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q","code":"AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq","state":"arbitrary_data"}';

        service = new AadcService(config, jwt);
        service.handleLoginCallbackFragment(hashFragment);

        expect(logger.infoMsg).toBe(expectedMsg);
    });

});

describe('AadcService', () => {
    let service: AadcService;

    beforeEach(() => {
        TestBed.configureTestingModule({ 
            providers: [AadcService, JwtUtilService,
                        { provide: Http, useClass: MockBackend },
                        { provide: AadcConfig, useClass: TestAadcConfig }],
         });

         service = TestBed.get(AadcService);
    });

    it('gets all dependencies properly injected (smoke)', () => {
        expect(service.Configuration).toBeDefined();
    });
});

class LoggerFake implements AadcLogger {

    /* Public properties */
    public logLevel: string;
    public infoMsg: string;
    public warnMsg: string;
    public errObj: Error;

    constructor(loggingLevel: string) {
        this.logLevel = loggingLevel;
    }

    logInfo(message: string) {
        this.infoMsg = message;
    }
    logWarning(message: string) {
        this.warnMsg = message;
    }
    logError(err: Error) {
        this.errObj = err;
    }
}

class TestAadcConfig {
    public clientId: string = '00000000-0000-0000-0000-000000000000';
    public domainName: string = 'testb2c.onmicrosoft.com';
    public localStoragePrefix: string = 'testb2c';
    public policies: any = {
        signin: 'B2C_1_SignIn1'
    };
    public promptSignIn: string = 'login';
    public redirectUrl: string = '/auth/signin';
    public responseMode: string = 'fragment';
    public scope: string = 'openid offline_access';
    public postLogoutUrl: string = 'http://test.io';
    public logger: AadcLogger;

    constructor() {
        this.logger = new LoggerFake('verbose');
    }
}

