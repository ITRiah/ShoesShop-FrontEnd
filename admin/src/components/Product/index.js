import classNames from 'classnames/bind';
import React, { useEffect } from 'react';
import { useState } from 'react';

import styles from './Product.module.scss';
import Ellipsis from '~/components/Ellipsis';
import { deleted } from '~/ultils/services/productService';

const cx = classNames.bind(styles);

function Product({ props, onEventDeleted, onUpdate }) {
    const [imgs, setImgs] = useState([]);
    const [img, setImg] = useState('');

    useEffect(() => {
        if (props.avatar) {
            setImgs(props.avatar.split('*||*'));
            setImg(props.avatar.split('*||*')[0]);
        }
    }, []);

    const formatPrice = new Intl.NumberFormat('vi-VN').format(props.price);
    const formatAmount = new Intl.NumberFormat('vi-VN').format(props.amount);

    const handleDelete = async () => {
        try {
            const response = await deleted(props.id);
            onEventDeleted(props.id); // Notify parent component of deleted event
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
            title: 'Chi tiết/ Sửa',
            onClick: onUpdate,
        },
        {
            title: 'Xóa',
            onClick: handleDeleteConfirmation,
        },
    ];

    return (
        <div className={cx('wrapper')} title={props.title}>
            <Ellipsis menu={menu} />
            <div className={cx('img')}>
                <img src={img} alt={props.title} />
            </div>
            <div className={cx('info')}>
                <p>{props.title}</p>
                <p>Giá: {formatPrice}đ</p>
                <div className={cx('info-more')}>
                    <div className={cx('left-info')}>
                        <p>
                            Màu sắc: <span className={cx('color')} style={{ background: `${props.color}` }}></span>
                        </p>
                        <p>Số lượng còn: {formatAmount}</p>
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
