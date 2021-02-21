import * as React from 'react';
import styles from './Materials.module.scss';
import Material from '../Models/Material';
import Event from '../Models/Event';
import { useSelector, useDispatch } from 'react-redux';
import config from '../constants/config';
import { Spin } from 'antd';
import { DownloadWithJwtViaFormPost } from '../utils/Utils';
import { getToken } from '../utils/auth';
import { IAppReducer } from '../Reducers';

const Materials = () => {

    const materials: Material[] = useSelector(state => state.viewEvent.materials as Material[]);
    const isFetching: boolean = useSelector(state => state.viewEvent.isFetching as boolean);
    const userName: string = useSelector((state: IAppReducer) => state.root.userName);
    const userId: string = useSelector((state: IAppReducer) => state.root.userId);
    const isEditor: boolean = useSelector((state: IAppReducer) => state.root.isEditor);
    const isViewer: boolean = useSelector((state: IAppReducer) => state.root.isViewer);

    // const contentElement = $(`div[class*=${styles.materials}]`).closest('div[class*=window]');
    // contentElement.scroll(debounce(() => {
    //     if (!isFetchingFull && contentElement && contentElement.length > 0) {
    //         console.log('onScroll');
    //         // Checks that the page has scrolled to the bottom
    //         if (!isFetching && materialsCount > 0 &&
    //             contentElement.innerHeight() + contentElement.scrollTop() + 50 > contentElement[0].scrollHeight) {
    //             console.log('Infinity load', materialsCount, materials);
    //             dispatch(infinityLoadEventMaterials(materialsCount, selectedEventForView));
    //         }
    //     }
    // }));

    return (
        <Spin spinning={isFetching}>
            <div className={styles.materials} >
                {materials.map((m, i) => (
                    // <a href={`${config.API_URL}attachments/${m.id}`} target='_blank'
                    <a target='_blank' // href={`#`}
                    onClick={() => DownloadWithJwtViaFormPost(`${config.API_URL}attachments/${m.id}`, m.fileName, 
                        getToken(userName, userId, isEditor, isViewer).token)}
                        key={`eventAttachments_${i}`} className={styles.element}>{m.fileName}</a>
                ))}
            </div >
        </Spin>
    );
};

export default Materials;