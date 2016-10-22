import { Injectable } from '@angular/core';

@Injectable()
export class JwtUtilService {

    /* Private fields */
    private jwtSeparator: string = '.';

    constructor() { }

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
}