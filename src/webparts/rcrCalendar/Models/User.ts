import Model from './Model';
import BaseLink from './BaseLink';

export default class User implements Model {
    public id: number;
    public login: string;
    public firstName: string;
    public lastName: string;
    public patronymic: string;
    // tslint:disable-next-line:variable-name
    public _links: BaseLink;
    [key: string]: string | number | Date | BaseLink;

}
