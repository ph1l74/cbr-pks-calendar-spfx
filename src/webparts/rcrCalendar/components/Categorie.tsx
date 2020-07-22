import * as React from 'react';
import styles from './Categories.module.scss';
import { ICategorieProps } from './ICategorieProps';

const Categorie = ({ info }: { info: ICategorieProps }) => {

    const [active, setActive] = React.useState(false);

    const categorieColor = info.color ? info.color : '#000000';
    const categorieStyle: React.CSSProperties = {
        backgroundColor: active ? categorieColor : "#ffffff"
    }

    const clickHandler = (id) => {
        console.log(id);
        setActive(!active);
    }

    return (
        <div className={styles.categorie} onClick={() => (clickHandler((info.id)))}>
            <div className={styles.box} style={categorieStyle}></div>
            <div className={styles.name}>{info.name}</div>
        </div>
    );
}



export default Categorie;