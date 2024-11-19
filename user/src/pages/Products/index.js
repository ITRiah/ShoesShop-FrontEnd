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
            const response = await getall('', '', id, '');
            if (response.status === 'success') {
                setProducts(response.data);
            } else {
                setProducts([
                    {
                        id: 1,
                        title: 'San pham 1',
                        avater: 'https://down-vn.img.susercontent.com/file/vn-11134258-7ras8-m2m946e5vmii89',
                        amount: 1000000,
                        price: 10000000,
                        status: '1',
                    },
                    {
                        id: 2,
                        title: 'San pham 2',
                        avater: 'https://down-vn.img.susercontent.com/file/vn-11134258-7ras8-m2m946e5vmii89',
                        amount: 1000000,
                        price: 10000000,
                        status: '1',
                    },
                ]);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyid(id);
            setCate(response.data[0]);
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
                    if (item.status === '1') {
                        return <ProductItem key={v4()} props={item} />;
                    }
                    return null;
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
