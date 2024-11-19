import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './ProductDetail.module.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faMobileScreen, faMoneyCheck, faShield } from '@fortawesome/free-solid-svg-icons';

import { addCart } from '~/ultils/session';

import { getbyid } from '~/ultils/services/productService';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function ProductDetail() {
    const [active, setActive] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [product, setProduct] = useState({});
    const [content, setContent] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyid(id);
            if (response.status === 'success') {
                console.log(content);
                setProduct(response.data[0]);
                setContent(response.data[0].content.split('*||*'));
            }
        };
        fetchData();
    }, [id]);

    const addtoCart = () => {
        const data = {
            id: id,
            name: product.title,
            img: product.avatar,
            price: product.price,
        };

        addCart(data);
        alert('Sản phẩm đã được thêm vào giỏ hàng');
    };

    const contentStyles = !showMore ? { maxHeight: '200px' } : {};

    const formatPrice = new Intl.NumberFormat('vi-VN').format(product.price);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('product')}>
                <div className={cx('img')}>
                    <img src={product.avatar} alt={product.title} />
                </div>
                <div className={cx('overview')}>
                    <div className={cx('name')}>
                        <p>{product.title}</p>
                        <p className={cx('amount')}>Còn lại: {product.amount}</p>
                    </div>
                    <div className={cx('info')}>
                        <div>{formatPrice + `đ`}</div>
                        <div>
                            <p>Dung lượng:</p>
                            <p>{content[1]}</p>
                        </div>
                        <div>
                            <p>Màu sắc:</p>
                            <p
                                style={{
                                    background: product.color,
                                }}
                            ></p>
                        </div>
                        <div>
                            <div className={cx('warranty')}>
                                <h3>Thông tin sản phẩm</h3>
                                <div>
                                    <span>
                                        <FontAwesomeIcon icon={faMobileScreen} />
                                    </span>
                                    Mới, đầy đủ phụ kiện từ nhà sản xuất
                                </div>
                                <div>
                                    <span>
                                        <FontAwesomeIcon icon={faBoxOpen} />
                                    </span>
                                    Máy, cáp, sách hướng dẫn, que chọc SIM
                                </div>
                                <div>
                                    <span>
                                        <FontAwesomeIcon icon={faShield} />
                                    </span>
                                    Bảo hành 12 tháng tại trung tâm bảo hành Chính hãng. 1 đổi 1 trong 30 ngày nếu có
                                    lỗi phần cứng từ nhà sản xuất.
                                </div>
                                <div>
                                    <span>
                                        <FontAwesomeIcon icon={faMoneyCheck} />
                                    </span>
                                    Giá sản phẩm đã bao gồm VAT
                                </div>
                            </div>
                        </div>
                    </div>
                    {product.amount <= 0 ? (
                        <div className={cx('over')}>Hết Hàng</div>
                    ) : (
                        <div className={cx('btn')}>
                            <Button onClick={addtoCart} outline large>
                                Thêm Vào Giỏ Hàng
                            </Button>
                            <Button to={routes.cart} onClick={addtoCart} primary large>
                                Mua Ngay
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className={cx('detail')}>
                <div className={cx('btn-sl')}>
                    <Button
                        onClick={() => {
                            setActive(true);
                        }}
                        style={!active ? { border: '1px solid #eee', color: '#ccc' } : {}}
                        outline
                    >
                        Mô tả
                    </Button>
                    <Button
                        onClick={() => {
                            setActive(false);
                        }}
                        style={active ? { border: '1px solid #eee', color: '#ccc' } : {}}
                        outline
                    >
                        Thông Số Kỹ Thuật
                    </Button>
                </div>

                {active ? (
                    <div className={cx('describe')}>
                        <div className={cx('text')} style={contentStyles}>
                            {product.summary}
                            <br />
                            <br />
                        </div>
                        <div className={cx('btn')}>
                            <Button
                                onClick={() => {
                                    setShowMore(!showMore);
                                }}
                                text
                            >
                                {showMore ? 'Thu gọn' : 'Xem Thêm'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={cx('parameter')}>
                        <div className={cx('row')}>
                            <p>RAM</p>
                            <p>{content[0]}</p>
                        </div>
                        <div className={cx('row')}>
                            <p>Dung lượng</p>
                            <p>{content[1]}</p>
                        </div>
                        <div className={cx('row')}>
                            <p>Công Nghệ Màn Hình</p>
                            <p>{content[2]}</p>
                        </div>
                        <div className={cx('row')}>
                            <p>Độ Phân Giải</p>
                            <p>{content[3]}</p>
                        </div>
                        <div className={cx('row')}>
                            <p>Tần Số Quét</p>
                            <p>{content[4]}</p>
                        </div>
                        <div className={cx('row')}>
                            <p>Chất Liệu</p>
                            <p>{content[5]}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;
