import * as React from 'react';
import styles from './Materials.module.scss';

const Materials = () => {

    const initMaterials = [{
        url: '/docs/1.pdf',
        title: 'Документ 1'
    },
    {
        url: '/docs/1.pdf',
        title: 'Документ 2'
    },
    {
        url: '/docs/1.pdf',
        title: 'Документ 3'
    }
    ]

    const [materials, setMaterials] = React.useState(initMaterials);

    return (
        <div className={styles.materials}>
            {materials.map((m, i) => (
                <a href={m.url} key={i} className={styles.element}>{m.title}</a>
            ))}
        </div >
    );
}

export default Materials