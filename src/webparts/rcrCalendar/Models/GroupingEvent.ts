import Model from './Model';
import BaseLink from './BaseLink';
import Event from './Event';

export default class GroupingEvent implements Model {
    public id: number;
    public key: string;
    public Value: Event[];
    public _links: BaseLink;
    [key: string]: string | number | BaseLink | Event[];

}
