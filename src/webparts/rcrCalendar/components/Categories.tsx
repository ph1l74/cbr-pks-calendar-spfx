import * as React from 'react';
import styles from './Categories.module.scss';
import Categorie from './Categorie';
import { ICategorieProps } from './ICategorieProps';

const Categories = () => {

    const initCategories: [ICategorieProps] = [
        {
            id: 1,
            name: "Мероприятия",
            color: "#ff0000"
        }
    ]
    const [categories, setCategories] = React.useState(initCategories);

    return (
        <div className={styles.categories}>
            <div className={styles.header}>События</div>
            {categories.map((c: ICategorieProps, i: number) => (
                <Categorie info={c} key={i}></Categorie>
            ))}
        </div>
    );
}

export default Categories;