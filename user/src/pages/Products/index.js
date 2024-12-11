import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './Products.module.scss';
import ProductItem from '~/components/ProductItem';
import Button from '~/components/Button';
import { getbyid } from '~/ultils/services/categoriesService';
import { getall } from '~/ultils/services/productService';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function Products() {
    const [showMore, setShowMore] = useState(false);
    const [products, setProducts] = useState([]);
    const [cate, setCate] = useState({});

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall('', '', '', [id], []);
            if (response.statusCode === 200) {
                setProducts(response.result);
            } else {
                setProducts([]);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyid(id);
            setCate(response.data);
        };
        fetchData();
    }, [id]);

    function handleClick() {
        setShowMore(!showMore);
    }

    const contentClasses = cx('content');

    const contentStyles = !showMore ? { maxHeight: '500px' } : {};
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>{cate.name && cate.name}</div>
            <div className={cx('list')}>
                {products.map((item) => {
                    return <ProductItem key={v4()} props={item} />;
                })}
            </div>

            {cate.description && (
                <div className={cx('description')}>
                    <div className={contentClasses} style={contentStyles}>
                        {cate.description}
                    </div>
                    <div className={cx('btn')}>
                        <Button onClick={handleClick} text>
                            {showMore ? 'Thu gọn' : 'Xem thêm'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
