import { AttachmentService } from "../services/Services";

export const parseUid = (uid: string) => {
    let id = 0;
    try{
        id = parseInt(uid);
    }
    catch{}
    id = id ?? 0;
    return isNaN(id) ? 0 : id; // 
}

export const generateUUID = () => { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const uploadFile = options => {

    const { onSuccess, onError, file, onProgress, data } = options;

    const fmData = new FormData();
    if (data && data.objId && data.type){
        fmData.append('objId', data.objId);
        fmData.append('objType', data.type);
        fmData.append('guid', data.guid);
    }
    const config = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: event => {
            console.log((event.loaded / event.total) * 100);
            onProgress({ percent: (event.loaded / event.total) * 100 }, file);
        }
    };
    fmData.append("files", file);
    AttachmentService.upload(fmData, config)
        .then(res => {
            onSuccess(file);
            console.log(res);
        })
        .catch(err => {
            const error = new Error('Some error');
            onError({ event: error });
        });
}
