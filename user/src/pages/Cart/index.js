import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import FormInput from '~/components/AuthForm/FormInput';
import Button from '~/components/Button';
import CartItem from './CartItem';
import routes from '~/config/routes';

// import { getCart, calculateTotal } from '~/ultils/session';
import styles from './Cart.module.scss';
import { v4 } from 'uuid';
import { getCookie, setCookie } from '~/ultils/cookie';
import { create, payments_vnpay, payments_response } from '~/ultils/services/OrdersService';
import { getProfile } from '~/ultils/services/userService';
import { isLogin } from '~/ultils/cookie/checkLogin';
import { getCart, updateCart, deleteCart } from '~/ultils/services/cartService';
import { getall } from '~/ultils/services/voucherService';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCab, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Cart() {
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [isValid, setIsValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedValueVoucher, setSelectedValueVoucher] = useState('');
    const [selectedVoucherObject, setSelectedVoucherObject] = useState(null);
    const [voucherList, setVoucherList] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [reloadComponent, setReloadComponent] = useState('');
    const [billingInfo, setBillingInfo] = useState({
        fullName: '',
        shippingAddress: '',
        shippingMethod: 'FAST',
        paymentMethod: 'CASH',
        phone: '',
        note: '',
    });

    const calculateTotal = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.productDetail.price * item.quantity, 0);
    };

    useEffect(() => {
        if (isLogin()) {
            const fetchData = async () => {
                const response = await getProfile();
                const user = response.data;
                setBillingInfo({
                    ...billingInfo,
                    fullName: `${user.firstName} ${user.lastName}`,
                    shippingAddress: `${user.address}`,
                    phone: '',
                });
            };
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (isLogin()) {
            const fetchData = async () => {
                const response = await getCart(1);
                console.log(response.data.cartDetails);
                if (response.statusCode === 200) {
                    setItems(response.data.cartDetails);
                }
            };

            fetchData();
        }
    }, [selectedVoucherObject, reloadComponent]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall();
            if (response.statusCode === 200) {
                setVoucherList(response.result);
            } else {
                setVoucherList([]);
            }
        };

        fetchData();
    }, [reloadComponent]);

    useEffect(() => {
        if (billingInfo.fullName && billingInfo.shippingAddress && billingInfo.phone) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [billingInfo]);

    useEffect(() => {
        if (!items.length) {
            setTotal(0);
            return;
        }

        let total = calculateTotal(items);
        let totalDiscount = 0;

        if (selectedVoucherObject) {
            totalDiscount = (total * selectedVoucherObject.value) / 100;

            // Apply the maximum discount limit
            if (totalDiscount > selectedVoucherObject.maxMoney) {
                totalDiscount = selectedVoucherObject.maxMoney;
            }

            total = total - totalDiscount;
        }

        setTotal(total);
    }, [items, selectedVoucherObject, reloadComponent, selectedValueVoucher]);

    useEffect(() => {
        if (!items.length) {
            setTotal(0);
            return;
        }

        let total = calculateTotal(items);
        let totalDiscount = 0;

        if (selectedVoucherObject) {
            totalDiscount = (total * selectedVoucherObject.value) / 100;

            // Apply the maximum discount limit
            if (totalDiscount > selectedVoucherObject.maxMoney) {
                totalDiscount = selectedVoucherObject.maxMoney;
            }

            total = total - totalDiscount;
        }

        setTotal(total);
    }, [items, reloadComponent]);

    const submit = async () => {
        if (!isValid) {
            toast.warn('Vui lòng nhập đủ thông tin liên hệ');
            return;
        }

        console.log('Submit clicked'); // Kiểm tra nút click hoạt động
        setIsSubmitting(true); // Disable nút
        console.log('isSubmitting:', isSubmitting); // Kiểm tra trạng thái sau khi set

        const pdIds = items.map((item) => item.id);

        const payload = {
            fullName: billingInfo.fullName,
            shippingAddress: billingInfo.shippingAddress,
            shippingMethod: 'FAST',
            paymentMethod: paymentMethod,
            phone: billingInfo.phone,
            note: billingInfo.note,
            price_total: total,
            cartDetailIds: pdIds,
            voucherId: selectedVoucherObject ? selectedVoucherObject.id : null,
        };

        try {
            if (isLogin()) {
                if (paymentMethod === 'CASH') {
                    const response = await create(payload);
                    console.log(response);
                    if (response.statusCode === 201) {
                        setReloadComponent(v4());
                        toast.success('Đặt hàng thành công');
                    } else {
                        toast.error(response.message);
                    }
                } else {
                    setCookie('billingInfo', billingInfo);
                    setCookie('totalAmounnt', total);
                    setCookie('voucher', selectedVoucherObject);
                    const response = await payments_vnpay(total);
                    if (response.statusCode === 200 && response.data.code === 'ok') {
                        window.open(response.data.paymentUrl, '_blank');
                    }
                }
            } else {
                toast.warn('Đăng nhập để đặt hàng');
            }
        } catch (error) {
            console.error('Error during submit:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsSubmitting(false); // Enable nút lại sau khi hoàn thành
            console.log('isSubmitting reset:', isSubmitting);
        }
    };

    return (
        <>
            {items.length ? (
                <div className={cx('wrapper')}>
                    {items.length > 0 ? (
                        <>
                            <div className={cx('left')}>
                                <div className={cx('pd-list')}>
                                    <table
                                        onClick={() => {
                                            setReloadComponent(v4());
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th>Hình ảnh</th>
                                                <th>Chi tiết</th>
                                                <th>Giá bán</th>
                                                <th>Số lượng</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item) => (
                                                <CartItem
                                                    key={item.id}
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
                                        value={billingInfo.fullName ?? ''}
                                        onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                                    />
                                    <FormInput
                                        label="Địa chỉ"
                                        value={!!billingInfo.shippingAddress ? billingInfo.shippingAddress : ''}
                                        onChange={(e) =>
                                            setBillingInfo({ ...billingInfo, shippingAddress: e.target.value })
                                        }
                                    />

                                    <div className={cx('contact')}>
                                        <FormInput
                                            label="Điện thoại"
                                            value={billingInfo.phone ?? ''}
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
                                    <div className={cx('voucher')}>
                                        <div>Voucher</div>
                                        <div>
                                            <select
                                                onChange={(e) => {
                                                    setSelectedValueVoucher(e.target.value);
                                                    const selectedCode = e.target.value;
                                                    const selectedVoucherObj = voucherList.find(
                                                        (voucher) => voucher.code === selectedCode,
                                                    );
                                                    if (selectedVoucherObj) {
                                                        setSelectedVoucherObject(selectedVoucherObj);
                                                    } else {
                                                        setSelectedVoucherObject(null);
                                                    }
                                                    setReloadComponent(v4());
                                                }}
                                                value={selectedValueVoucher}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: '#f9f9f9',
                                                    color: '#333',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                <option value="">Chọn voucher</option>
                                                {voucherList.map((value) => {
                                                    return (
                                                        <option key={v4()} value={value.code}>{`${value.code}`}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={cx('voucherDescription')}>
                                        {selectedVoucherObject ? (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#f9f9f9',
                                                    color: '#333',
                                                    fontSize: '14px',
                                                    lineHeight: '1.6',
                                                    marginTop: '10px',
                                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: selectedVoucherObject.description,
                                                }}
                                            />
                                        ) : null}
                                    </div>
                                    <br></br>
                                    <div className={cx('PaymentMethod')}>
                                        <div>Phương thức thanh toán</div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="paymentmethod"
                                                id="paymentmethod1"
                                                value="CASH"
                                                defaultChecked
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            &nbsp;
                                            <label htmlFor="paymentmethod1">Thanh toán khi nhận hàng</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="paymentmethod"
                                                id="paymentmethod2"
                                                value="CREDIT_CARD"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            &nbsp;
                                            <label htmlFor="paymentmethod2">Thanh toán online</label>
                                        </div>
                                    </div>
                                    <div className={cx('sum')}>
                                        <p>Tổng cộng: </p>
                                        <p>{new Intl.NumberFormat('vi-VN').format(total)}đ</p>
                                    </div>
                                    <div>
                                        <Button
                                            className={cx('btn-submit')}
                                            onClick={submit}
                                            primary
                                            disabled={isSubmitting} // Disable khi đang chờ response
                                        >
                                            {isSubmitting ? 'Đang xử lý...' : 'Đặt Hàng'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            ) : (
                <div className={cx('empty-cart')}>
                    <FontAwesomeIcon icon={faCartPlus} />
                </div>
            )}
        </>
    );
}

export default Cart;
