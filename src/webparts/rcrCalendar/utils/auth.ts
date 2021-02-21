import { decode, encode, TAlgorithm } from 'jwt-simple';
import { DecodeResult, EncodeResult, PartialSession, Session } from './authSession';

export function encodeSession(secretKey: string, partialSession: PartialSession): EncodeResult {
    // Always use HS512 to sign the token
    const algorithm: TAlgorithm = 'HS512';
    const issued = Math.round(Date.now()/1000);
    const payloadSession: Session = {
        ...partialSession,
        issued: issued
    };

    return {
        token: encode(payloadSession, secretKey, algorithm),
        issued: issued,
        expires: payloadSession.exp
    };
}

export function decodeSession(secretKey: string, tokenString: string): DecodeResult {
    // Always use HS512 to decode the token
    const algorithm: TAlgorithm = 'HS512';

    let result: Session;

    try {
        result = decode(tokenString, secretKey, false, algorithm);
    } catch (_e) {
        const e: Error = _e;

        // These error strings can be found here:
        // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
        if (e.message === 'No token supplied' || e.message === 'Not enough or too many segments') {
            return {
                type: 'invalid-token'
            };
        }

        if (e.message === 'Signature verification failed' || e.message === 'Algorithm not supported') {
            return {
                type: 'integrity-error'
            };
        }

        // Handle json parse errors, thrown when the payload is nonsense
        if (e.message.indexOf('Unexpected token') === 0) {
            return {
                type: 'invalid-token'
            };
        }

        throw e;
    }

    return {
        type: 'valid',
        session: result
    };
}

const secretKey = 'CalendarKeyToken';

// export const auth = () => {

    export const getToken = (userName: string, userId: string, isEdit: boolean, isRead: boolean) => {
        const expires = Math.round(Date.now()/1000) + (60 * 60);
        const session: PartialSession = {
            // id: userId,
            // dateCreated: Date.now(),
            username: userName,
            exp: expires,
            iss: 'RCRCalendarApp',
            aud: 'RCRCalendarApp',
            isEdit: isEdit,
            isRead: isRead
        };
        return encodeSession(secretKey, session);
    };
// }