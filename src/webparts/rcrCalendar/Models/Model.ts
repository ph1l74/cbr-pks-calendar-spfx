import BaseLink from './BaseLink';




export default interface Model {
    id: number;
    _links: BaseLink
    // [key: string]: BaseLink | number | undefined
}
