import Model from './Model';
import BaseLink from './BaseLink';
import Category from './Category';
import Comment from './Comment';
import Actor from './Actor';
import Material from './Material';
import Link from './Link';
import User from './User';

export default class Event implements Model {
    public id: number;
    public name: string;
    public category: Category;
    public location: string;
    public description: string;
    public authorLogin: string;
    public fullDay: boolean;
    public startDate: Date;
    public endDate: Date;
    public freeVisiting: boolean;
    public comments: Comment[];
    public participantsCount: number;
    public attachmentsCount: number;
    public feedbacksCount: number;
    public actors: Actor[];
    public materials: Material[];
    public links: Link[];
    public author: User;
    public participants: string[];
    public sessionGuid: string;
    // tslint:disable-next-line:variable-name
    public _links: BaseLink;
    // [key: string]: number | string | BaseLink | Category | boolean;

}
