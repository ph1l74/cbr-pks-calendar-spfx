import * as React from 'react';
import styles from './Categories.module.scss';
import Categorie from './Categorie';
import Category from '../Models/Category';
import { connect } from 'react-redux';

const Categories = (categories: Category[]) => {

    const renderCategories = (categories: any) => {
        let i = 1;
        return categories.categories.map(c => (
            <Categorie info={c} key={i++} ></Categorie>
        ));
    };
    // const initCategories: [ICategorieProps] = [
    //     {
    //         id: 1,
    //         name: 'Мероприятия',
    //         color: '#ff0000'
    //     }
    // ]
    // const [categories, setCategories] = React.useState(initCategories);

    return (
        <div className={styles.categories}>
            <div className={styles.header}>События</div>
            {renderCategories(categories)}
        </div>
    );
};

const mapStateToProps = (store: any) => {
    return {
        categories: store.root.categories,
    };
};

export default connect(mapStateToProps)(Categories);