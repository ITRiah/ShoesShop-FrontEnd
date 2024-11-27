import classNames from 'classnames/bind';
import React from 'react';

import styles from './Product.module.scss';
import Ellipsis from '~/components/Ellipsis';
import { deleted } from '~/ultils/services/productService';

const cx = classNames.bind(styles);

function Product({ props, onEventDeleted, onUpdate }) {

    const formatPrice = new Intl.NumberFormat('vi-VN').format(props.priceRange);

    const handleDelete = async () => {
        try {
            const response = await deleted(props.id);   
            onEventDeleted(props.id);
        } catch (error) {
            console.log(error);
        } finally {
            console.log('Deleted');
        }
    };

    const handleDeleteConfirmation = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            handleDelete();
        }
    };

    const menu = [
        {
            title: 'Sửa',
            onClick: onUpdate,
        },
        {
            title: 'Xóa',
            onClick: handleDeleteConfirmation,
        },
    ];

    return (
        <div className={cx('wrapper')} title={props.name}>
            <Ellipsis menu={menu} />
            <div className={cx('img')}>
                <img src={props.img} alt={props.name} />
            </div>
            <div className={cx('info')}>
                <p>{props.name}</p>
                <p>Giá: {formatPrice}đ</p>
                <div className={cx('info-more')}>
                    <div className={cx('left-info')}>
                        <p>
                            Màu sắc: <span className={cx('color')} style={{ background: `${props.color}` }}></span>
                        </p>
                    </div>
                    <div className={cx('right-info')}>
                        {props.status === '1' ? (
                            <p style={{ color: 'green' }}>Đang bán</p>
                        ) : (
                            <p style={{ color: 'red' }}>Ẩn</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;
