import classNames from 'classnames/bind';

import styles from './Order.module.scss';

import { getbyuserid, getbyid, deleted } from '~/ultils/services/OrdersService';
import { getCookie } from '~/ultils/cookie';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Orders() {
    const [orders, setOrders] = useState([]);
    const [active, setActive] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyuserid(getCookie('login').id);
            if (response.status === 'success') {
                setOrders(response.data);
                console.log(response.data);
            } else {
                setOrders([]);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyid(active.id);
            if (response.status === 'success') {
                setProducts(response.products);
            } else {
                setProducts([]);
            }
        };
        fetchData();
    }, [active]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('list')}>
                <h3>Danh sách đơn hàng</h3>
                <div className={cx('class-fake')}>
                    <div className={cx('scroll')}>
                        {orders.map((item) => {
                            const formatPrice = new Intl.NumberFormat('vi-VN').format(item.price_total);
                            return (
                                <div
                                    onClick={() => {
                                        setActive(item);
                                    }}
                                    key={v4()}
                                    className={cx('item')}
                                    style={item === active ? { background: '#ccc' } : { background: '#ddd' }}
                                >
                                    <p>Mã đơn: {item.id}</p>
                                    <p>Ngày tạo: {item.created_at}</p>
                                    <p>Tổng tiền: {formatPrice}đ</p>
                                    <div
                                        className={cx('status')}
                                        style={
                                            item.payment_status === '1'
                                                ? { background: 'green' }
                                                : { background: 'red' }
                                        }
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={cx('detail')}>
                <h3>Chi tiết đơn hàng</h3>
                {active ? (
                    <div>
                        <h4>Mã đơn: {active.id}</h4>
                        <div className={cx('info')}>
                            <p>Người nhận: {active.fullname}</p>
                            <p>Địa chỉ: {active.address}</p>
                            <p>Điện thoại: {active.mobile}</p>
                            <p>Email: {active.email}</p>
                            <p>Thành tiền: {new Intl.NumberFormat('vi-VN').format(active.price_total)}đ</p>
                        </div>
                        <div>
                            <p>Ghi chú: {active.note}</p>
                        </div>
                        <div className={cx('pd-list')}>
                            <h4>Danh sách mặt hàng</h4>
                            {products.length > 0 ? (
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>Hình ảnh</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Giá bán</th>
                                            <th>Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((item) => {
                                            return (
                                                <tr key={v4()}>
                                                    <td>
                                                        <img src={item.avatar} alt={item.title} />
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <p>{item.title}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat('vi-VN').format(item.product_price)}đ
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : null}
                        </div>
                        <div className={cx('action')}>
                            {active.payment_status === '1' ? (
                                <>
                                    <Button className={cx('btn-delete')} primary small disabled>
                                        Hủy đơn
                                    </Button>
                                    <Button className={cx('btn-payment')} primary small disabled>
                                        Đã thanh toán
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className={cx('btn-delete')} primary small onClick={async () => {}}>
                                        Hủy đơn
                                    </Button>
                                    <Button className={cx('btn-payment')} primary small>
                                        Thanh toán
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>Chọn đơn hàng để xem chi tiết</div>
                )}
            </div>
        </div>
    );
}

export default Orders;
