export interface User {
    id: string;
    dateCreated: number;
    username: string;
    password: string;
}

export interface Session {
    // id: string;
    // dateCreated: number;
    username: string;
    /**
     * Timestamp indicating when the session was created, in Unix milliseconds.
     */
    issued: number;
    /**
     * Timestamp indicating when the session should expire, in Unix milliseconds.
     */
    // expires: number;
    exp: number;
    iss: string;
    aud: string;
    isEdit: boolean;
    isRead: boolean;
}

/**
 * Identical to the Session type, but without the `issued` and `expires` properties.
 */
export type PartialSession = Omit<Session, 'issued' | 'expires'>;

export interface EncodeResult {
    token: string;
    expires: number;
    issued: number;
}

export type DecodeResult =
    | {
          type: 'valid';
          session: Session;
      }
    | {
          type: 'integrity-error';
      }
    | {
          type: 'invalid-token';
      };

export type ExpirationStatus = 'expired' | 'active' | 'grace';