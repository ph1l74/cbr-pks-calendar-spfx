import BaseLink from "./BaseLink";




export default interface Model {
    id: number;
    _links: BaseLink
    //[key: string]: string | number | undefined
}
