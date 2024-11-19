import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import ProductsIntro from '~/components/ProductsIntro';

import { getall } from '~/ultils/services/categoriesService';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function Home() {
    const [cate, setCate] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall('', '');
            if (response.statusCode === 200) {
                setCate(response.data);
            } else {
                setCate([]);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            {cate.map((item) => {
                if ((item.type === '0' && item.status === '1') || true) {
                    return <ProductsIntro key={v4()} title={item.name} id={item.id} />;
                }
                return null;
            })}
        </div>
    );
}

export default Home;
