import * as React from 'react';
import styles from './Categories.module.scss';
import Category from '../Models/Category';
import { connect } from 'react-redux'
import { changeSelectedCategory } from '../Actions';
import { bindActionCreators } from 'redux'
import FilterEvent from '../utils/IFilterEvent';

interface ICategorieProps {
    info: Category,
    selectCategory: (id: number) => void,
}
// const Categorie = ({ info }: { info: Category }, {selectCategory}: {selectCategory: any}) => {
const Categorie = (props: {info: Category,  filterEvent: FilterEvent, selectCategory: (id: number,  filterEvent: FilterEvent) => any}) => {

    const [active, setActive] = React.useState(false);

    const {info} = props;
    const categorieColor = info.color ? info.color : '#000000';
    const categorieStyle: React.CSSProperties = {
        backgroundColor: active ? categorieColor : "#ffffff"
    }

    const clickHandler = (id) => {
        console.log(id);
        setActive(!active);
        // changeSelectedCategory(id);
        props.selectCategory(id, props.filterEvent);
    }

    console.log(info, props.selectCategory);
    return (
        <div className={styles.categorie} onClick={() => (clickHandler((info.id)))}>
            <div className={styles.box} style={categorieStyle}></div>
            <div className={styles.name}>{info.name}</div>
        </div>
    );
}


const mapStateToProps = (store: any) => {
    return {
        filterEvent: store.event.filterEvent
    };
}
const mapDispatchToProps = dispatch => {
    // return bindActionCreators({ selectCategory: (id: number) => changeSelectedCategory(id) }, dispatch)
    return {
        selectCategory: (id: number,  filterEvent: FilterEvent) => dispatch(changeSelectedCategory(id, filterEvent)) // [1]
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categorie)