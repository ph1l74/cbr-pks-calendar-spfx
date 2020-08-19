import Model from './Model'
import BaseLink from './BaseLink'
import Event from './Event'
import Comment from '../../../../lib/webparts/rcrCalendar/Models/Comment';

export default class Link implements Model {
    constructor(id: number, linkName: string){
        this.id = id;
        this.linkName = linkName;
    }
    public id: number;
    public linkName: string;
    public event: Event;
    public eventId: number;
    public comment: Comment;
    public commentId: number;
    public _links: BaseLink;
    [key: string]: string | number | Date | BaseLink | Event | Comment;

}