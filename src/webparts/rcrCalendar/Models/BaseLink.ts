export class BaseHref {
    public href: string;
}
// tslint:disable-next-line:max-classes-per-file
export default class BaseLink {
    public self: BaseHref;
    public getRegpInf: BaseHref;
}

export const emptyBaseLink = new BaseLink();
