import classNames from 'classnames/bind';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './Cart.module.scss';

import { update, removeFromCart } from '~/ultils/session';
import { getbyid } from '~/ultils/services/productService';

const cx = classNames.bind(styles);

function CartItem({ item, onUpdateTotal }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [product, setProduct] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyid(item.product.id);
            setProduct(response.data[0]);
        };
        fetchData();
    }, [item]);

    const formatPrice = useMemo(() => new Intl.NumberFormat('vi-VN').format(item.product.price), [item.product.price]);

    const handleUpdate = useCallback(
        (newQuantity) => {
            update(item.product, newQuantity);
            setQuantity(newQuantity);
            onUpdateTotal();
        },
        [item.product, onUpdateTotal],
    );

    const handleRemoveFromCart = useCallback(() => {
        removeFromCart(item.product);
        onUpdateTotal();
    }, [item.product, onUpdateTotal]);

    return (
        <tr>
            <td>
                <img src={item.product.img} alt="n" />
            </td>
            <td>
                <div>
                    <p>{item.product.name}</p>
                </div>
            </td>
            <td>{formatPrice}đ</td>
            <td>
                <input
                    value={quantity}
                    onChange={(e) => {
                        let newQuantity = parseInt(e.target.value);
                        if (isNaN(newQuantity)) {
                            newQuantity = 0;
                        }
                        handleUpdate(newQuantity);
                    }}
                    style={{ textAlign: 'center' }}
                    type="number"
                    min="1"
                    max={product.amount}
                />
            </td>
            <td>
                <FontAwesomeIcon onClick={handleRemoveFromCart} className={cx('delete-icon')} icon={faTrashCan} />
            </td>
        </tr>
    );
}

export default CartItem;
