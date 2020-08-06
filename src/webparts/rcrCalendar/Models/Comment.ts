import Model from './Model';
import BaseLink from './BaseLink';
import Event from './Event';
import Material from './Material';
import User from './User';
import Link from './Link';

export default class Comment implements Model {
    public id: number;
    public description: string;
    public authorLogin: string;
    public author: User;
    public modifiedDate: Date;
    public event: Event;
    public eventID: number;
    public materials: Material[];
    public links: Link[];
    // tslint:disable-next-line:variable-name
    public _links: BaseLink;
    // [key: string]: string | number | Date | BaseLink | Event | boolean | Material[] | User;

}
