import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

import styles from './ProductDetail.module.scss';
import Button from '~/components/Button';
import { getbyid } from '~/ultils/services/productService';
import { updateCart } from '~/ultils/services/cartService';
import routes from '~/config/routes';
import { isLogin } from '~/ultils/cookie/checkLogin';

const cx = classNames.bind(styles);

function ProductDetail() {
    const [active, setActive] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const [product, setProduct] = useState({});
    const [selectedSize, setSelectedSize] = useState(null); // No default size selected
    const [selectedColor, setSelectedColor] = useState(null); // No default color selected
    const [selectedImage, setSelectedImage] = useState(''); // No default image
    const [selectedPrice, setSelectedPrice] = useState(''); // No default price
    const [selectedProductDetail, setSelectedProductDetail] = useState(''); // No

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyid(id);
            if (response.statusCode === 200) {
                setProduct(response.data);
                setSelectedImage(response.data.img);
                // No need to select a default size, color, or image here
            }
        };
        fetchData();
    }, [id]);

    const handleSizeClick = (size) => {
        setSelectedSize(size);
        const firstMatchingItem = product.productDetailResponseList?.find(
            (item) => item.size === size && item.color === selectedColor,
        );
        if (firstMatchingItem) {
            setSelectedImage(firstMatchingItem.img);
            setSelectedPrice(firstMatchingItem.price);
        }
    };

    const addtoCart = async () => {
        if (isLogin()) {
            if (selectedSize && selectedColor) {
                const data = {
                    productDetailId: selectedProductDetail.id,
                    quantity: 1,
                };
                try {
                    const response = await updateCart(data); // Đợi xử lý cập nhật giỏ hàng
                    if (response.statusCode === 201) {
                        // alert('Sản phẩm đã được thêm vào giỏ hàng');
                        toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
                        return true; // Thành công
                    } else {
                        toast.error('Không thể thêm sản phẩm vào giỏ hàng');
                        return false; // Lỗi
                    }
                } catch (error) {
                    toast.error('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng');
                    return false; // Lỗi
                }
            } else {
                toast.warn('Vui lòng chọn size và màu sắc');
                return false; // Không đủ thông tin
            }
        } else {
            toast.error('Đăng nhập để thêm sản phẩm vào giỏ hàng');
        }
    };

    // Format price range or selected price
    const getPriceRange = () => {
        if (!selectedSize || !selectedColor) {
            // Calculate the min and max prices from product details
            const prices = product.productDetailResponseList?.map((item) => item.price) || [];
            if (prices.length) {
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                return `${new Intl.NumberFormat('vi-VN').format(minPrice)}đ - ${new Intl.NumberFormat('vi-VN').format(
                    maxPrice,
                )}đ`;
            }
        }
        // If size/color is selected, display the selected price
        return selectedPrice ? new Intl.NumberFormat('vi-VN').format(selectedPrice) + 'đ' : '';
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('product')}>
                <div className={cx('img')}>
                    <img src={selectedImage || 'default-image-path'} alt={product.name} />
                </div>
                <div className={cx('overview')}>
                    <div className={cx('name')}>
                        <p>{product.name}</p>
                    </div>
                    <div className={cx('info')}>
                        <div>{getPriceRange()}</div> {/* Display price range or selected price */}
                        {selectedProductDetail ? (
                            <div>
                                <p style={{ marginRight: '10px' }}>Số lượng:</p>
                                <span>{selectedProductDetail.quantity}</span>
                            </div>
                        ) : null}
                        <div>
                            <p style={{ marginRight: '10px' }}>Size:</p>
                            <div>
                                {product.productDetailResponseList
                                    ?.reduce((acc, item) => {
                                        if (!acc.includes(item.size)) acc.push(item.size);
                                        return acc;
                                    }, [])
                                    .sort((a, b) => a - b)
                                    .map((size) => (
                                        <p
                                            key={size}
                                            onClick={() => handleSizeClick(size)}
                                            style={{
                                                display: 'inline-block',
                                                marginRight: '10px',
                                                padding: '5px 10px',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontWeight: selectedSize === size ? 'bold' : 'normal',
                                                backgroundColor: selectedSize === size ? '#f0f0f0' : 'transparent',
                                            }}
                                        >
                                            {size}
                                        </p>
                                    ))}
                            </div>
                        </div>
                        <div>
                            <p style={{ marginRight: '10px' }}>Màu sắc:</p>
                            <div>
                                {product.productDetailResponseList
                                    ?.reduce((acc, item) => {
                                        if (!acc.find((detail) => detail.color === item.color)) acc.push(item);
                                        return acc;
                                    }, [])
                                    .map((item) => {
                                        const isAvailable = product.productDetailResponseList.some(
                                            (detail) => detail.color === item.color && detail.size === selectedSize,
                                        );

                                        return (
                                            <span
                                                key={item.color}
                                                onClick={() => {
                                                    if (isAvailable) {
                                                        setSelectedColor(item.color);
                                                        setSelectedImage(item.img);
                                                        setSelectedPrice(item.price);
                                                        setSelectedProductDetail(item);
                                                    }
                                                }}
                                                style={{
                                                    display: 'inline-block',
                                                    width: '30px',
                                                    height: '30px',
                                                    borderRadius: '50%',
                                                    backgroundColor: item.color,
                                                    marginRight: '10px',
                                                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                    border:
                                                        selectedColor === item.color
                                                            ? '3px solid #333'
                                                            : '1px solid #000',
                                                    opacity: isAvailable ? 1 : 0.3,
                                                }}
                                            ></span>
                                        );
                                    })}
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
                            <Button
                                onClick={async () => {
                                    const success = await addtoCart(); // Gọi hàm addtoCart và chờ xử lý
                                    if (success) {
                                        navigate(routes.cart);
                                    }
                                }}
                                primary
                                large
                            >
                                Mua Ngay
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className={cx('detail')}>
                <div className={cx('btn-sl')}>
                    <Button
                        onClick={() => setActive(true)}
                        style={!active ? { border: '1px solid #eee', color: '#ccc' } : {}}
                        outline
                    >
                        Mô tả
                    </Button>
                    <Button
                        onClick={() => setActive(false)}
                        style={active ? { border: '1px solid #eee', color: '#ccc' } : {}}
                        outline
                    >
                        Nhà cung cấp
                    </Button>
                </div>
                {active ? (
                    <div className={cx('describe')}>
                        <div className={cx('text')}>{product.summary}</div>
                        <div className={cx('btn')}>
                            <Button onClick={() => setShowMore(!showMore)} text>
                                {showMore ? 'Thu gọn' : 'Xem Thêm'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={cx('parameter')}></div>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;
