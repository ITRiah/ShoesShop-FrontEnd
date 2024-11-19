import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import FormInput from '~/components/AuthForm/FormInput';
import Button from '~/components/Button';
import CartItem from './CartItem';
import routes from '~/config/routes';

import { getCart, calculateTotal } from '~/ultils/session';
import styles from './Cart.module.scss';
import { v4 } from 'uuid';
import { getCookie } from '~/ultils/cookie';
import { create } from '~/ultils/services/OrdersService';
import { getbyid } from '~/ultils/services/userService';
import { isLogin } from '~/ultils/cookie/checkLogin';

const cx = classNames.bind(styles);

function Cart() {
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [isValid, setIsValid] = useState(false);
    const [billingInfo, setBillingInfo] = useState({
        fullName: '',
        address: '',
        email: '',
        phone: '',
        note: '',
    });

    useEffect(() => {
        if (isLogin()) {
            const fetchData = async () => {
                const response = await getbyid(getCookie('login').id);
                const user = response.data[0];

                setBillingInfo({
                    ...billingInfo,
                    fullName: `${user.first_name} ${user.last_name}`,
                    address: `${user.address}`,
                    email: `${user.email}`,
                    phone: `${user.phone}`,
                });
            };
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (billingInfo.fullName && billingInfo.address && billingInfo.email && billingInfo.phone) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [billingInfo]);

    const [reloadComponent, setReloadComponent] = useState('');

    useEffect(() => {
        setItems(JSON.parse(localStorage.getItem('cartItems')) || getCart());
        setTotal(calculateTotal(getCart()));
    }, [reloadComponent]);

    useEffect(() => {
        const call = () => {
            localStorage.setItem('cartItems', JSON.stringify(items));
            setTotal(calculateTotal(items));
        };
        call();
    }, [items]);

    const submit = async () => {
        if (!isValid) {
            alert('Vui lòng nhập đủ thông tin liên hệ');
        } else {
            const payload = {
                user_id: getCookie('login').id,
                fullname: billingInfo.fullName,
                address: billingInfo.address,
                email: billingInfo.email,
                mobile: billingInfo.phone,
                note: billingInfo.note,
                price_total: total,
                products: items,
            };

            if (isLogin()) {
                const fetchData = async () => {
                    const response = await create(payload);
                    if (response.data.status === 'success') {
                        localStorage.setItem('cartItems', JSON.stringify([]));
                        setItems([]);
                        alert('Đặt hàng thành công');
                    } else {
                        alert(response.data.message);
                    }
                };
                fetchData();
            } else {
                alert('Đăng nhập để đặt hàng');
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            {items.length > 0 ? (
                <>
                    <div className={cx('left')}>
                        <div className={cx('pd-list')}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Hình ảnh</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Giá bán</th>
                                        <th>Số lượng</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <CartItem
                                            key={item.product.id}
                                            item={item}
                                            onUpdateTotal={() => {
                                                setReloadComponent(v4());
                                            }}
                                            reloadComponent={reloadComponent}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            <div className={cx('other-handel')}>
                                <Button outline to={routes.home}>
                                    Tiếp tục mua sắm
                                </Button>
                            </div>
                        </div>
                        <h3>Thông tin thanh toán</h3>
                        <div className={cx('billing-info')}>
                            <FormInput
                                label="Họ tên"
                                value={billingInfo.fullName}
                                onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                            />
                            <FormInput
                                label="Địa chỉ"
                                value={billingInfo.address}
                                onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                            />

                            <div className={cx('contact')}>
                                <FormInput
                                    label="Email"
                                    value={billingInfo.email}
                                    onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                                />
                                <FormInput
                                    label="Điện thoại"
                                    value={billingInfo.phone}
                                    onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Ghi chú: </label>
                                <textarea
                                    className={cx('note')}
                                    value={billingInfo.note}
                                    onChange={(e) => setBillingInfo({ ...billingInfo, note: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cx('right')}>
                        <div className={cx('sidebar-cart')}>
                            <div className={cx('sum')}>
                                <p>Tổng cộng: </p>
                                <p>{new Intl.NumberFormat('vi-VN').format(total)}đ</p>
                            </div>
                            <div>
                                <Button className={cx('btn-submit')} onClick={submit} primary>
                                    Đặt Hàng
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className={cx('empty-cart')}>
                    <h3>Giỏ hàng rỗng</h3>
                </div>
            )}
        </div>
    );
}

export default Cart;
