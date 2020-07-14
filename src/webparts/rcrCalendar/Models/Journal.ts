import Model from './Model';
import BaseLink from './BaseLink';

export default class Journal implements Model {
    public id: number;
    public bic: string;
    public edNo: number;
    public crOrgBrShrtNm: string;
    public statusCalculation: string;
    public statusCalculationId: number;
    public kindSt: string;
    public edDt: Date;
    public protocolOutEsId: number;
    public messageOutNumber: number;
    public messageOutDt: Date;
    // tslint:disable-next-line:variable-name
    public _links: BaseLink;
    [key: string]: string | number | Date | BaseLink;

}
