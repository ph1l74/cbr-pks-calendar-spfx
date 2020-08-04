export const parseUid = (uid: string) => {
    let id = 0;
    try{
        id = parseInt(uid);
    }
    catch{}
    id = id ?? 0;
    return isNaN(id) ? 0 : id; // 
}