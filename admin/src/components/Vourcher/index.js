import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Vourcher.module.scss';
import images from '~/assets/images';
import Ellipsis from '~/components/Ellipsis';
import { deleted } from '~/ultils/services/voucherService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Vourcher({ props, onEventDeleted, onUpdate }) {
    const bg = props.type === '0' ? images.bgProduct : images.bgArticles;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await deleted(props.id);
            if (response.statusCode === 204) {
                toast.success(response.message);
            }
            onEventDeleted(props.id);
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteConfirmation = () => {
        if (
            window.confirm(
                'Bạn có chắc chắn muốn xóa danh mục này không?\nMọi sản phẩm hoặc bài viết trong danh mục sẽ bị xóa.',
            )
        ) {
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

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div style={{ background: `url(${bg})` }} className={cx('wrapper')}>
            <Ellipsis menu={menu} />
            <div className={cx('info')}>
                <p>Mã: {props.code}</p>
                <p>Giá trị: {props.value}%</p>
                <p>Số lượng: {props.quantity}</p>
                <p>Tối đa: {formatCurrency(props.maxMoney)}</p>
                <p>Hạn: {formatDate(props.expiredTime)}</p>
            </div>
        </div>
    );
}

export default Vourcher;
