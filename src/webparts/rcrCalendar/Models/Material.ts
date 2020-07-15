import Model from './Model';
import BaseLink from './BaseLink';
import Comment from './Comment';
import Event from './Event';

export default class Category implements Model {
    public id: number;
    public fileName: string;
    public _links: BaseLink;
    public comment: Comment;
    public event: Event;
    [key: string]: string | number | Date | BaseLink | Comment | Event;

}
