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

export const uploadFile = options => {

    const { onSuccess, onError, file, onProgress, data } = options;

    const fmData = new FormData();
    if (data && data.objId && data.type){
        fmData.append('objId', data.objId);
        fmData.append('objType', data.type);
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
