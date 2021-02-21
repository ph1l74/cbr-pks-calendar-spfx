import Model from './Model';
import BaseLink from './BaseLink';
import Comment from './Comment';
import Event from './Event';

export default class Material implements Model {
    constructor(id: number, fileName: string){
        this.fileName = fileName;
        this.id = id;
    }
    public id: number;
    public fileName: string;
    public file: string;
    public _links: BaseLink;
    public comment: Comment;
    public commentID: number;
    public event: Event;
    public eventID: number;
    public hash: string;
    [key: string]: string | number | Date | BaseLink | Comment | Event;

}
