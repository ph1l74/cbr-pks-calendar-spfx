import Model from './Model';
import BaseLink from './BaseLink';
import Event from './Event';
import Material from './Material';

export default class Comment implements Model {
    public id: number;
    public description: string;
    public authorLogin: string;
    public modifiedDate: Date;
    public event: Event;
    public materials: Material[];
    // tslint:disable-next-line:variable-name
    public _links: BaseLink;
    [key: string]: string | number | Date | BaseLink | Event | boolean | Material[];

}
