import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Category.module.scss';
import images from '~/assets/images';
import Ellipsis from '~/components/Ellipsis';
import { deleted } from '~/ultils/services/categoriesService';

const cx = classNames.bind(styles);

function Category({ props, onEventDeleted, onUpdate }) {
    const bg = props.type === '0' ? images.bgProduct : images.bgArticles;
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await deleted(props.id);
            onEventDeleted(props.id); // Notify parent component of deleted event
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteConfirmation = () => {
        if (
            window.confirm(
                'Bạn có chắc chắn muốn xóa danh mục này không?\n Mọi sản phẩm hoặc bài viết trong danh mục sẽ bị xóa.',
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
                <p>create by adminid: {props.admin_id}</p>
                <p>Category type: {props.type === '0' ? 'Product' : 'Articles'}</p>
                <p>
                    Trạng Thái:
                    {props.status === '1' ? (
                        <span className="success"> Enable</span>
                    ) : (
                        <span className="error"> Disable</span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default Category;
