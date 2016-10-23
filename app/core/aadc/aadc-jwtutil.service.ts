import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class JwtUtilService {

    /* Private fields */
    private jwtSeparator: string = '.';

    constructor(private http: Http) {

     }

    /* Public methods */
    public decodeUrlBase64(encoded: string): string {
        let str: string = encoded.replace(/-/g, '+').replace(/_/g, '/');
        switch (str.length % 4) {
            case 0:
                // no = to append    
                break;
            case 2:
                str += '==';
                break;
            case 3:
                str += '=';
            default:
                throw new Error('Illegal base64url encoded string passed. Decoding not possible.');
        }

        return decodeURIComponent(encodeURI(typeof window === 'undefined' ? atob(str) : window.atob(str)));
    }

    public getTokenHeader(token: string): string {
        return this.extractTokenPart(token, 0);
    }

    public getTokenHeaderDecoded(token: string): any {
        let decoded: string = this.decodeUrlBase64(this.getTokenHeader(token));
        if(!decoded) {
            throw new Error('Cannot decode JWT token header. Please check the token passed along.');
        }
        return JSON.parse(decoded);
    }

    public getTokenBody(token: string): string {
        return this.extractTokenPart(token, 1);
    }

    public getTokenBodyDecoded(token: string): any {
        let decoded: string = this.decodeUrlBase64(this.getTokenBody(token));
        if(!decoded) {
            throw new Error('Cannot decode JWT token body. Please check the token passed along.');
        }
        return JSON.parse(decoded);
    }

    public getTokenSignature(token: string) {
        return this.extractTokenPart(token, 2);
    }

    public getRsaPublicKeys(domainName: string, policy: string): Observable<RsaPublicKey[]> {
        // Note: At the moment the MS discovery endpoint cannot handle CORS properly,
        //       therefore this call needs to be submitted to a local API that 
        //       calls the discovery endpoint from the server-side:
        let url: string = 'http://localhost:8701/discovery/keys?d=' + domainName +
                            '&p=' + policy;
                            
        return this.http.get(url)
                        .map(this.mapRsaPublicKeysResponse)
                        .catch(this.handleHttpError);
    }


    /* Private methods */
    private splitTokenString(token: string, separator: string): string[] {
        return token.split(separator);
    }

    private extractTokenPart(token: string, partNo: number) {
        let parts: string[] = this.splitTokenString(token, this.jwtSeparator);

        if (parts.length !== 3) {
            throw new Error('JWT must consist of 3 parts. Invalid token with ' + parts.length + ' part(s) passed along.');
        }

        return parts[partNo];
    }

    private mapRsaPublicKeysResponse(res: Response): RsaPublicKey[] {
        let body: any = JSON.parse(res.json());
        return body.keys ? body.keys : [] as RsaPublicKey[];
    }

    private handleHttpError(error: any) {
         let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` :
                'Server error';
        return Observable.throw(errMsg);
    }
}

export interface RsaPublicKey {
    kid: string;
    use: string;
    kty: string;
    e: string;
    n: string;
    nbf?:string;
}