import User from './User';

export default class Actor {
    constructor(eventId: number, userLogin: string) {
        this.eventId = eventId;
        this.userLogin = userLogin;
    }
    public eventId: number;
    public userLogin: string;
    public user: User;
}