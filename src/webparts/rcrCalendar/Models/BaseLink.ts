export class BaseHref {
    public href: string;
    // [key: string]: string | number | undefined
}
// tslint:disable-next-line:max-classes-per-file
export default class BaseLink {
    public self: BaseHref;
    public getRegpInf: BaseHref;
    // [key: string]: BaseHref | number | undefined
}

export const emptyBaseLink = new BaseLink();
