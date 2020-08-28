import { AttachmentService } from '../services/Services';
import * as $ from 'jquery';
import axios, { AxiosRequestConfig } from 'axios';

export const parseUid = (uid: string) => {
    let id = 0;
    try {
        id = parseInt(uid);
    }
    catch{ }
    id = id ?? 0;
    return isNaN(id) ? 0 : id; //
};

export const generateUUID = () => { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

export const uploadFile = options => {

    const { onSuccess, onError, file, onProgress, data } = options;

    const fmData = new FormData();
    if (data) {
        fmData.append('objId', data.objId ?? 0);
        if (data.objType) {
            fmData.append('objType', data.objType);
        }
        if (data.guid) {
            fmData.append('guid', data.guid);
        }
    }
    const config = {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: event => {
            console.log((event.loaded / event.total) * 100);
            onProgress({ percent: (event.loaded / event.total) * 100 }, file);
        }
    };
    fmData.append('files', file);
    AttachmentService.upload(fmData, config)
        .then(res => {
            onSuccess(file);
            console.log(res);
        })
        .catch(err => {
            const errMess = 'При загрузке файлов возникла ошибка';
            const error = new Error(errMess);
            console.log(errMess, err);
            onError({ event: error });
        });
};

export const DownloadWithJwtViaFormPost = (url: string, fileName: string, token: string) => {
    // var jwtInput = $('<input type="hidden" name="jwtToken">').val('Bearer ' + token);
    // var idInput = $('<input type="hidden" name="id">').val(id);
    // $('<form method="post" target="_blank"></form>')
    //             .attr("action", url)
    //             .append(jwtInput)
    //             .append(idInput)
    //             .appendTo('body')
    //             .submit()
    //             .remove();
    axios({
        url: url,
        method: 'GET',
        responseType: 'blob', // important
        headers: {
            'authorization': 'Bearer ' + token
        }
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
}