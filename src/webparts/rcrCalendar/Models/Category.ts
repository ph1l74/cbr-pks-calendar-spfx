import Model from './Model';
import BaseLink from './BaseLink';

export default class Category implements Model {
    public id: number;
    public name: string;
    public color: string;
    public _links: BaseLink;
    [key: string]: string | number | Date | BaseLink;

}
