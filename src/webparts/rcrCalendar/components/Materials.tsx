import * as React from 'react';
import styles from './Materials.module.scss';
import Material from '../Models/Material';
import Event from '../Models/Event';
import { useSelector, useDispatch } from 'react-redux';
import config from '../constants/config';
import { infinityLoadEventMaterials } from '../Actions';
import * as $ from 'jquery';
import { debounce } from 'lodash';
import { Spin } from 'antd';

const Materials = () => {

    const selectedEventForView: Event = useSelector(state => state.viewEvent.selectedEvent as Event);
    const materials: Material[] = useSelector(state => state.viewEvent.materials as Material[]);
    const materialsCount: number = useSelector(state => state.viewEvent.materials.length);
    const isFetching: boolean = useSelector(state => state.viewEvent.isFetching as boolean);
    const isFetchingFull: boolean = useSelector(state => state.viewEvent.isFetchingFull as boolean);
    const dispatch = useDispatch();

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
                    <a href={`${config.API_URL}attachments/${m.id}`} target='_blank'
                        key={`eventAttachments_${i}`} className={styles.element}>{m.fileName}</a>
                ))}
            </div >
        </Spin>
    );
};

export default Materials;