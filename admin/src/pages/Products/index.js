import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import styles from './Products.module.scss';
import FormProducts from './FormProducts';
import FormCreateProductDetail from './FormCreateProductDetail';
import FormProductDetails from './FormProductDetails';
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
    const [formType, setFormType] = useState('product');
    const [idShow, setIdShow] = useState('');
    const [idDetailShow, setIdDetailShow] = useState('');
    const [name, setName] = useState('');
    const [biggerPrice, setBiggerPrice] = useState('');
    const [lowerPrice, setLowerPrice] = useState('');
    const [procedure, setProcedure] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall(name, lowerPrice, biggerPrice, procedure);
            if (response.statusCode === 200) {
                setData(response.result);
            } else {
                setData([]);
            }
        };
        fetchData();
    }, [deleted, created, name, biggerPrice, lowerPrice, procedure]);

    const onEventDeleted = (id) => {
        setDeleted(id);
    };

    function onChangeDetailId(detailId) {
        setFormType('createProductDetail');
        setIdDetailShow(detailId);
    }

    return (
        <div>
            {(showForm || (idShow && showForm)) && formType === 'product' ? (
                <FormProducts
                    onSuccess={(e) => {
                        if (e === 204 || e === 201) {
                            setCreated(v4());
                        }
                    }}
                    id={idShow}
                    onClose={() => {
                        setShowForm(false);
                        setIdShow('');
                    }}
                    title="Thêm Sản Phẩm"
                />
            ) : null}
            {(showForm || (idShow && showForm) || (idShow && showForm && idDetailShow)) &&
            formType === 'createProductDetail' ? (
                <FormCreateProductDetail
                    onSuccess={() => {
                        setIdDetailShow('');
                        setCreated(v4());
                    }}
                    id={idShow}
                    onClose={() => {
                        setIdDetailShow('');
                        setShowForm(false);
                        setIdShow('');
                    }}
                    idDetail={idDetailShow}
                    title="Thêm Chi Tiết Sản Phẩm"
                />
            ) : null}
            {(showForm || (idShow && showForm)) && formType === 'productDetails' ? (
                <FormProductDetails
                    onSuccess={() => {
                        setCreated(v4());
                    }}
                    id={idShow}
                    onClose={() => {
                        setShowForm(false);
                        setIdShow('');
                    }}
                    onEventDeleted={onEventDeleted}
                    onChangeDetailId={onChangeDetailId}
                    title="Chi Tiết Sản Phẩm"
                />
            ) : null}
            <WhiteBG title="Quản Lý Sản Phẩm">
                <div className={cx('wrapper')}>
                    <div className={cx('filter')}>
                        <FormFilter
                            Add={() => {
                                setShowForm(true);
                                setFormType('product');
                            }}
                            search={(n, p, c, s) => {
                                setName(n);
                                setBiggerPrice(p);
                                setLowerPrice(c);
                                setProcedure(s);
                            }}
                        />
                    </div>
                    <div className={cx('list')}>
                        {data.map((props) => {
                            return (
                                <Product
                                    onUpdate={() => {
                                        setShowForm(true);
                                        setIdShow(props.id);
                                        setFormType('product');
                                    }}
                                    onCreateDetail={() => {
                                        setIdDetailShow('');
                                        setShowForm(true);
                                        setIdShow(props.id);
                                        setFormType('createProductDetail');
                                    }}
                                    onShowDetail={() => {
                                        setShowForm(true);
                                        setIdShow(props.id);
                                        setFormType('productDetails');
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
