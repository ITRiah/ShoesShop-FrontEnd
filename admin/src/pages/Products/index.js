import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import styles from './Products.module.scss';
import FormProducts from './FormProducts';
import { getall } from '~/ultils/services/productService';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Product from '~/components/Product';
import FormFilter from './FormFilter';

const cx = classNames.bind(styles);

function Products() {
    const [data, setData] = useState([]);
    const [deleted, setDeleted] = useState('');
    const [created, setCreated] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [idShow, setIdShow] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall(name, price, category, status);
            if (response.status === 'success') {
                setData(response.data);
            } else {
                setData([]);
            }
        };
        fetchData();
    }, [deleted, created, name, price, category, status]);

    const onEventDeleted = (id) => {
        setDeleted(id);
    };

    return (
        <div>
            {showForm || idShow ? (
                <FormProducts
                    onSuccess={() => {
                        setCreated(v4());
                    }}
                    id={idShow}
                    onClose={() => {
                        setShowForm(false);
                        setIdShow('');
                    }}
                    title="Thêm Sản Phẩm"
                />
            ) : null}
            <WhiteBG title="Quản Lý Sản Phẩm">
                <div className={cx('wrapper')}>
                    <div className={cx('filter')}>
                        <FormFilter
                            Add={() => {
                                setShowForm(true);
                            }}
                            search={(n, p, c, s) => {
                                setName(n);
                                setPrice(p);
                                setCategory(c);
                                setStatus(s);
                            }}
                        />
                    </div>
                    <div className={cx('list')}>
                        {data.map((props) => {
                            return (
                                <Product
                                    onUpdate={() => {
                                        setIdShow(props.id);
                                    }}
                                    onEventDeleted={onEventDeleted}
                                    key={v4()}
                                    props={props}
                                />
                            );
                        })}
                    </div>
                </div>
            </WhiteBG>
        </div>
    );
}

export default Products;
