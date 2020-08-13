// import Maybe from '../util/Maybe'
import config from '../constants/config';
import axios, { AxiosRequestConfig } from 'axios';
import * as moment from 'moment';
import { auth } from '../utils/auth';

export default class Service<T> {
    private dataHandlers: Array<(value: T, index: number) => void> = [];

    constructor(public apiPath: string) {
        this.apiPath = apiPath;
        
    axios.interceptors.request.use((config: AxiosRequestConfig) => {
        let token = auth.getToken();

        if (token) {
          config.headers['authorization'] = 'Token ' + token;
        }
        return config;
      });      
    }

    public async findAll(sliceDate?: string): Promise<T[]> {
        let apiURL = this.apiPath;
        if (!apiURL) {
            return new Array<T>();
        }
        let sliceDateParam = '';
        if (sliceDate) {
            apiURL = apiURL.replace('/', '')
            sliceDateParam = `${(apiURL.indexOf('?') > -1 ? '&' : '?') + 'slicedate=' + sliceDate}`
        }
        if (navigator.vendor === '' && navigator.userAgent.indexOf('Firefox') < 0) {
            console.log(navigator);
            //sliceDate = YYYY-MM-DD
            const response = await axios.get(
                config.API_URL + apiURL + `${apiURL.indexOf('?') > -1 ? '&' : '?'}time=${Date.now().toString()}` + sliceDateParam.replace('?', '&'),
                {
                    xsrfCookieName: Date.now().toString(),
                    //headers: { Pragma: 'no-cache' } // Что-то в Rest произошло, что для IE 11 это значение стало ненужным, но до этого запросы кэшировались
                });

            // const newLocal: string = await response.data._embedded != null ? response.data._embedded[apiURL.replace('/', '')] : response.data; 
            // Так сделано из-за разного формата возвращаемых данных из Rest

            const newLocal: string = await response.data._embedded != null ? response.data._embedded[apiURL.substr(0, apiURL.indexOf('/'))] : response.data; // Так сделано из-за разного формата возвращаемых данных из Rest

            console.log('New parse ', newLocal);
            try {
                const json: T[] = JSON.parse(JSON.stringify(newLocal), this.ConvertDateTime) as T[];

                return json;
            } catch (e) {
                const json: T[] = JSON.parse(JSON.stringify(newLocal)) as T[];

                return json;
            }
        }

        const response = await axios.get(config.API_URL + apiURL + sliceDateParam, {});
        // const newLocal: string = await response.data._embedded != null ? response.data._embedded[apiURL.replace('/', '')] : response.data; // Так сделано из-за разного формата возвращаемых данных из Rest
        const newLocal: string = await response.data._embedded != null ? response.data._embedded[apiURL.substr(0, apiURL.indexOf('/'))] : response.data; // Так сделано из-за разного формата возвращаемых данных из Rest
        // console.log('New parse ', response.data, response.data._embedded);
        const json: T[] = JSON.parse(JSON.stringify(newLocal), this.ConvertDateTime) as T[];
        this.dataHandlers.forEach((handler) => {
            json.forEach(handler);
        });
        return json;
    }

    public async getRecord(): Promise<T> {
        const apiURL = this.apiPath;
        const response = await axios.get(config.API_URL + apiURL, {
        });
        const json: T = (await response.data) as T;
        return json;
    }

    public async getRecordById(id: number): Promise<T> {
        const apiURL = this.apiPath;
        const response = await axios.get(config.API_URL + apiURL + id, {
        });
        const json: T = (await response.data) as T;
        return json;
    }

    public async remove(id: number): Promise<any> {
        const apiURL = this.apiPath;
        const response = await axios.delete(config.API_URL + apiURL + id, {
        });
        const json = await response.data;
        return json;
    }

    public async add(record: T): Promise<any> {
        const apiURL = this.apiPath;
        // console.log('Add record', record);
        const response = await axios.post(config.API_URL + apiURL, record, {
        });
        // console.log('Add record', response);
        const json = await response.data;
        return json;
    }

    public upload(files, options): Promise<any> {
        const apiURL = this.apiPath;
        console.log('Upload record', files);
        return axios.post(config.API_URL + apiURL, files, options);
    }

    public async uploadFiles(files): Promise<string> {
        const apiURL = this.apiPath;
        console.log('Upload record', files);
        const response = await axios.post(config.API_URL + apiURL, files, {
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // }
        });
        const json = response.data;
        console.log('Upload response', response, json);
        return json.url;
    }

    public async update(record: T, id: number): Promise<any> {
        const apiURL = this.apiPath;
        const response = await axios.put(config.API_URL + apiURL + id, record, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': 'DELETE, POST, PUT, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
            },
        });
        const json = await response.data;
        return json;
    }

    public async search(request: string): Promise<T[]> {
        const apiURL = this.apiPath;
        const response = await axios.post(config.API_URL + apiURL.replace('/', '') + request,
            {
                xsrfCookieName: Date.now().toString(),
            });
        const newLocal: string = await response.data;
        // console.log('New search ', response, newLocal);
        const json: T[] = JSON.parse(JSON.stringify(newLocal), this.ConvertDateTime) as T[];
        // const json: Array<T> = (await response.data._embedded[apiURL.replace('/', '')]) as Array<T>;
        this.dataHandlers.forEach((handler) => {
            json.forEach(handler);
        });

        return json;
    }

    public async searchGet(request: string): Promise<T[]> {
        const apiURL = this.apiPath;
        const response = await axios.get(config.API_URL + apiURL.replace('/', '') + request,
            {
                withCredentials: false,
                // headers: {
                //   'Access-Control-Allow-Origin': '*',
                //   'Content-Type': 'application/json',
                // },
                xsrfCookieName: Date.now().toString(),
            });
        const newLocal: string = await response.data;
        // console.log('New search ', response, newLocal);
        const json: T[] = JSON.parse(JSON.stringify(newLocal), this.ConvertDateTime) as T[];
        // const json: Array<T> = (await response.data._embedded[apiURL.replace('/', '')]) as Array<T>;
        this.dataHandlers.forEach((handler) => {
            json.forEach(handler);
        });

        return json;
    }

    public async searchParam(request: string): Promise<T> {
        const apiURL = this.apiPath;
        const response = await axios.get(config.API_URL + apiURL.replace('/', '') + request,
            {
                xsrfCookieName: Date.now().toString(),
            });
        const json: T = (await response.data) as T;
        return json;
    }

    public withDateFields(fields: Array<keyof T>) {
        this.dataHandlers.push((value: any, index: number) => {

            fields.forEach((field) => {
                value[field] = new Date(value[field].toString());
            });
        });
        return this;
    }
    public ConvertDateTime(key: any, value: any): any {
        if (typeof value === 'string' && value != null && (key.indexOf('Dt') >= 0 || key.indexOf('Date') >= 0)) {
            const a = /^[0-9]{4}[/\-][0-9]{2}[/\-][0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/.exec(value);
            // let a = /\/Date\((\d*)\)\//.exec(value);
            if (a) {
                try {
                    // console.log(value, moment(value), moment(value).toDate(), new Date(value));
                    const newDate = moment(value).toDate();
                    // let newDate = new Date(value);
                    // const newDate: Date = new Date(+a[1]);
                    // console.log('UTC', value, newDate, newDate.getTimezoneOffset());
                    return newDate;
                } catch {
                    alert('Error for date');
                }
            }
        }
        return value;
    }
}
// tslint:disable-next-line:max-classes-per-file
export class PagedService<T> {
    private dataHandlers: Array<(value: T, index: number) => void> = [];

    constructor(public apiPath: string) {
        this.apiPath = apiPath;
    }

    public async findAll(page: number = 1, size: number = 10, search: any): Promise<[T[], number]> {
        const apiURL = this.apiPath;

        console.log(
            'performing request yo REST',
            config.API_URL + apiURL + `?page=${page - 1}&size=${size}`,
            'payload',
            search,
        );
        // tslint:disable-next-line:no-debugger

        const response = await axios.post(config.API_URL + apiURL + `?page=${page - 1}&size=${size}`, search, {
            xsrfCookieName: Date.now().toString(),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('New parse ', response.data._embedded);

        // const json: Array<T> = JSON.parse(JSON.stringify(newLocal), this.ReviveDateTime) as Array<T>;
        const json = response.data.content as T[];
        this.dataHandlers.forEach((handler) => {
            json.forEach(handler);
        });
        // tslint:disable-next-line:no-debugger
        return [json, response.data.totalElements];
    }

    public async findByCriteria(
        page: number = 1,
        size: number = 10,
        criteria: { [key: string]: string | string[] },
    ): Promise<[T[], number]> {
        const apiURL = this.apiPath;
        console.log(
            'performing request yo REST',
            config.API_URL + apiURL + `?page=${page - 1}&size=${size}`,
            'payload:',
            criteria,
        );
        // tslint:disable-next-line:no-debugger

        const response = await axios.post(config.API_URL + apiURL + `?page=${page - 1}&size=${size}`, criteria, {
            xsrfCookieName: Date.now().toString(),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('New parse ', response.data._embedded);
        // const json: Array<T> = JSON.parse(JSON.stringify(newLocal), this.ReviveDateTime) as Array<T>;
        const json = response.data.content as T[];
        this.dataHandlers.forEach((handler) => {
            json.forEach(handler);
        });
        // tslint:disable-next-line:no-debugger
        return [json, response.data.totalElements];
    }

    public async getRecordById(id: number): Promise<T> {
        const apiURL = this.apiPath;
        const response = await axios.get(config.API_URL + apiURL + id, {
        });
        const json: T = (await response.data) as T;
        return json;
    }

    public async remove(id: number): Promise<any> {
        const apiURL = this.apiPath;
        const response = await axios.delete(config.API_URL + apiURL + id, {
        });
        const json = await response.data;
        return json;
    }

    public async add(record: T): Promise<any> {
        const apiURL = this.apiPath;
        // console.log('Add record', record);
        const response = await axios.post(config.API_URL + apiURL, record, {
            headers: { Pragma: 'no-cache' },
        });
        // console.log('Add record', response);
        const json = await response.data;
        return json;
    }

    public async update(record: T, id: number): Promise<any> {
        const apiURL = this.apiPath;
        const response = await axios.put(config.API_URL + apiURL + id, record, {
        });
        const json = await response.data;
        return json;
    }

    public async search(page: number = 1, size: number = 10, search: string): Promise<T[]> {
        const apiURL = this.apiPath;
        const response = await axios
            .post(
                config.API_URL + apiURL.replace('/', '') + `?page=${page}&size=${size}&` + search,
                {
                    xsrfCookieName: Date.now().toString(),
                    headers: { Pragma: 'no-cache' },
                });
        const newLocal: string = await response.data;
        const json: T[] = JSON.parse(JSON.stringify(newLocal), this.ReviveDateTime) as T[];
        // this.dataHandlers.forEach(handler => {
        //     json.forEach(handler)
        // });

        return json;
    }

    public withDateFields(fields: Array<keyof T>) {
        this.dataHandlers.push((value: any, index: number) => {

            fields.forEach((field) => {
                value[field] = new Date(value[field].toString());
            });
        });
        return this;
    }
    public ReviveDateTime(key: any, value: any): any {
        if (typeof value === 'string' && value != null) {
            const a = /^[0-9]{4}[/\-][0-9]{2}[/\-][0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/.exec(value);
            // let a = /\/Date\((\d*)\)\//.exec(value);
            if (a) {
                try {
                    // console.log(value, moment(value), moment(value).toDate(), new Date(value));
                    const newDate = moment(value).toDate();

                    // let newDate = new Date(value);
                    // const newDate: Date = new Date(+a[1]);
                    // console.log('UTC', value, newDate, newDate.getTimezoneOffset());
                    return newDate;
                } catch {
                    alert('Error for date');
                }
            }
        }
        return value;
    }
}
