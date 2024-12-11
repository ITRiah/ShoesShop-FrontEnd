import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Category.module.scss';
import images from '~/assets/images';
import Ellipsis from '~/components/Ellipsis';
import { deleted } from '~/ultils/services/categoriesService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Category({ props, onEventDeleted, onUpdate }) {
    const bg = props.type === '0' ? images.bgProduct : images.bgArticles;
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await deleted(props.id);
            if (response.statusCode === 204) toast.success(response.message);
            onEventDeleted(props.id);
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteConfirmation = () => {
        if (!props.isDeleted) {
            if (
                window.confirm(
                    'Bạn có chắc chắn muốn xóa danh mục này không?\n Mọi sản phẩm hoặc bài viết trong danh mục sẽ bị xóa.',
                )
            ) {
                handleDelete();
            }
        } else {
            handleDelete();
        }
    };
    const menu = [
        {
            title: 'Chi tiết/ Sửa',
            onClick: onUpdate,
        },
        {
            title: props.isDeleted ? 'Khôi phục' : 'Xóa',
            onClick: handleDeleteConfirmation,
        },
    ];

    return (
        <div style={{ background: `url(${bg})` }} className={cx('wrapper')}>
            <Ellipsis menu={menu} />
            {props.avatar ? (
                <div className={cx('img')}>
                    <img src={props.avatar} alt={props.name} />
                </div>
            ) : (
                ''
            )}
            <div className={cx('info')}>
                <p>{props.name}</p>
                <p>Tạo bởi: {props.admin_id}</p>
                <p>
                    Trạng Thái:
                    {props.isDeleted ? (
                        <span className="error"> Disable</span>
                    ) : (
                        <span className="success"> Enable</span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default Category;
