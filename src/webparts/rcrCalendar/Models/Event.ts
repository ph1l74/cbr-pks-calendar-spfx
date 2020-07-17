import Model from './Model';
import BaseLink from './BaseLink';
import Category from './Category';
import Comment from './Comment';

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
    // tslint:disable-next-line:variable-name
    public _links: BaseLink;
    [key: string]: string | number | Date | BaseLink | Category | boolean | Comment[];

}
